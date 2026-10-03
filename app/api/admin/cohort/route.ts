import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const adminSupabase = await createAdminClient();
    const { data: cohort, error } = await adminSupabase
      .from("cohort_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ cohort });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // Verify admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userProfile } = await adminSupabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = ["admin", "super_admin", "course_admin"].includes(userProfile?.role);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      title,
      headline,
      subheadline,
      cohort_date,
      duration_hours,
      max_seats,
      seats_taken,
      price_inr,
      original_price_inr,
      zoom_link,
      is_active,
      show_countdown,
      siteSettings, // hero copy, image, stats
    } = body;

    // ── 1. Upsert cohort_settings ──
    let cohortResult;
    if (id) {
      const { data, error } = await adminSupabase
        .from("cohort_settings")
        .update({
          title,
          headline,
          subheadline,
          cohort_date,
          duration_hours: Number(duration_hours),
          max_seats: Number(max_seats),
          seats_taken: Number(seats_taken),
          price_inr: Number(price_inr),
          original_price_inr: Number(original_price_inr),
          zoom_link,
          is_active: is_active ?? true,
          show_countdown: show_countdown ?? true,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      cohortResult = data;
    } else {
      const { data, error } = await adminSupabase
        .from("cohort_settings")
        .insert({
          title: title || "AI Masterclass with Neeraj Kumar",
          headline: headline || "Build, Automate & Scale with Generative AI in 3 Hours",
          subheadline:
            subheadline ||
            "Join 12,000+ professionals mastering prompt engineering & autonomous agents.",
          cohort_date: cohort_date || new Date(Date.now() + 3 * 86400000).toISOString(),
          duration_hours: Number(duration_hours) || 3,
          max_seats: Number(max_seats) || 100,
          seats_taken: Number(seats_taken) || 87,
          price_inr: Number(price_inr) || 299,
          original_price_inr: Number(original_price_inr) || 2999,
          zoom_link: zoom_link || "https://zoom.us/j/pcl-live-masterclass",
          is_active: true,
          show_countdown: true,
          updated_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      cohortResult = data;
    }

    // ── 2. Upsert site_settings for hero + stats ──
    if (siteSettings && typeof siteSettings === "object") {
      const upsertRows = Object.entries(siteSettings).map(([key, value]) => ({
        key,
        value: value ?? "",
        updated_at: new Date().toISOString(),
      }));

      if (upsertRows.length > 0) {
        const { error: settingsError } = await adminSupabase
          .from("site_settings")
          .upsert(upsertRows, { onConflict: "key" });

        if (settingsError) {
          console.error("site_settings upsert error:", settingsError);
          // Non-fatal — cohort update succeeded; report partial success
          return NextResponse.json({
            success: true,
            cohort: cohortResult,
            warning: "Cohort saved but site settings update failed: " + settingsError.message,
          });
        }
      }
    }

    return NextResponse.json({ success: true, cohort: cohortResult });
  } catch (error: any) {
    console.error("Error saving cohort settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cohort" },
      { status: 500 }
    );
  }
}
