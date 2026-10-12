import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

interface SettingRow {
  key: string;
  value: string;
}

export async function GET() {
  try {
    const adminSupabase = await createAdminClient();
    const { data: settings, error } = await adminSupabase
      .from("site_settings")
      .select("key, value");

    if (error) throw error;

    const settingsList = (settings ?? []) as SettingRow[];
    const settingsMap = Object.fromEntries(
      settingsList.map((s) => [s.key, s.value])
    );

    return NextResponse.json({ settings: settingsMap });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

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
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { painPoints, bonuses } = body;

    const upsertRows: Array<{ key: string; value: string; label: string; updated_by: string; updated_at: string }> = [];
    const now = new Date().toISOString();

    if (painPoints) {
      if (painPoints.badge !== undefined) {
        upsertRows.push({
          key: "pain_points_badge",
          value: String(painPoints.badge),
          label: "Does This Sound Like You badge",
          updated_by: user.id,
          updated_at: now,
        });
      }
      if (painPoints.title !== undefined) {
        upsertRows.push({
          key: "pain_points_title",
          value: String(painPoints.title),
          label: "Does This Sound Like You title",
          updated_by: user.id,
          updated_at: now,
        });
      }
      if (painPoints.subtitle !== undefined) {
        upsertRows.push({
          key: "pain_points_subtitle",
          value: String(painPoints.subtitle),
          label: "Does This Sound Like You subtitle",
          updated_by: user.id,
          updated_at: now,
        });
      }
      if (painPoints.items !== undefined) {
        upsertRows.push({
          key: "pain_points_items",
          value: JSON.stringify(painPoints.items),
          label: "Does This Sound Like You statement items",
          updated_by: user.id,
          updated_at: now,
        });
      }
    }

    if (bonuses) {
      if (bonuses.badge !== undefined) {
        upsertRows.push({
          key: "bonuses_badge",
          value: String(bonuses.badge),
          label: "Free Bonuses badge",
          updated_by: user.id,
          updated_at: now,
        });
      }
      if (bonuses.title !== undefined) {
        upsertRows.push({
          key: "bonuses_title",
          value: String(bonuses.title),
          label: "Free Bonuses title",
          updated_by: user.id,
          updated_at: now,
        });
      }
      if (bonuses.subtitle !== undefined) {
        upsertRows.push({
          key: "bonuses_subtitle",
          value: String(bonuses.subtitle),
          label: "Free Bonuses subtitle",
          updated_by: user.id,
          updated_at: now,
        });
      }
      if (bonuses.items !== undefined) {
        upsertRows.push({
          key: "bonuses_items",
          value: JSON.stringify(bonuses.items),
          label: "Free Bonuses item list",
          updated_by: user.id,
          updated_at: now,
        });
      }
    }

    if (upsertRows.length > 0) {
      const { error: upsertError } = await adminSupabase
        .from("site_settings")
        .upsert(upsertRows, { onConflict: "key" });

      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ success: true, message: "Website content saved successfully" });
  } catch (error: unknown) {
    console.error("Error saving website content:", error);
    const msg = error instanceof Error ? error.message : "Failed to save website content";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
