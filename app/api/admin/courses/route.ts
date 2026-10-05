import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const adminSupabase = await createAdminClient();
    const { data: courses, error } = await adminSupabase
      .from("courses")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const body = await request.json();
    const {
      id,
      title,
      slug,
      headline,
      description,
      category,
      price_inr,
      original_price_inr,
      course_duration_hours,
      difficulty_level,
      drive_url,
      zoom_link,
      status,
      features,
      curriculum,
    } = body;

    let result;
    if (id) {
      // Update
      const { data, error } = await adminSupabase
        .from("courses")
        .update({
          title,
          slug,
          headline,
          description,
          category,
          price_inr: Number(price_inr),
          original_price_inr: Number(original_price_inr),
          course_duration_hours: Number(course_duration_hours),
          difficulty_level,
          drive_url,
          zoom_link,
          status: status || "published",
          features: Array.isArray(features) ? features : [],
          curriculum: Array.isArray(curriculum) ? curriculum : [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert
      const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data, error } = await adminSupabase
        .from("courses")
        .insert({
          title,
          slug: generatedSlug,
          headline,
          description,
          category: category || "Artificial Intelligence",
          price_inr: Number(price_inr) || 299,
          original_price_inr: Number(original_price_inr) || 2999,
          course_duration_hours: Number(course_duration_hours) || 3,
          difficulty_level: difficulty_level || "Beginner",
          drive_url,
          zoom_link,
          status: status || "published",
          features: Array.isArray(features) ? features : [],
          curriculum: Array.isArray(curriculum) ? curriculum : [],
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, course: result });
  } catch (error: any) {
    console.error("Error creating/updating course:", error);
    return NextResponse.json({ error: error.message || "Failed to save course" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    // Verify admin role
    const { data: userProfile } = await adminSupabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = ["admin", "super_admin", "course_admin"].includes(userProfile?.role);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Unlink any active cohort settings that point to this course first
    await adminSupabase
      .from("cohort_settings")
      .update({ course_id: null })
      .eq("course_id", id);

    const { error: deleteError } = await adminSupabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: error.message || "Failed to delete course" }, { status: 500 });
  }
}

