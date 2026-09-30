import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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

    const { courseId, progressPercent } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const progress = Math.min(100, Math.max(0, Number(progressPercent) || 0));
    const isComplete = progress >= 100;

    // Update enrollment progress
    const { data: enrollment, error: updateError } = await adminSupabase
      .from("enrollments")
      .update({
        progress_percent: progress,
        status: isComplete ? "completed" : "active",
        completed_at: isComplete ? new Date().toISOString() : null,
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .select("*, courses(title)")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
    }

    // Auto-generate certificate if 100% complete and certificate does not already exist
    let certData = null;
    if (isComplete) {
      const { data: existingCert } = await adminSupabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (!existingCert) {
        const { data: userProfile } = await adminSupabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();

        const certCode = `PCL-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
        const studentName = userProfile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner";

        const { data: newCert } = await adminSupabase
          .from("certificates")
          .insert({
            user_id: user.id,
            course_id: courseId,
            enrollment_id: enrollment.id,
            certificate_code: certCode,
            student_name: studentName,
            course_title: enrollment.courses?.title || "Masterclass",
            issued_at: new Date().toISOString(),
          })
          .select()
          .single();

        certData = newCert;
      } else {
        certData = existingCert;
      }
    }

    return NextResponse.json({
      success: true,
      progress,
      isComplete,
      certificate: certData,
    });
  } catch (error: any) {
    console.error("Error updating course progress:", error);
    return NextResponse.json({ error: error.message || "Failed to update progress" }, { status: 500 });
  }
}
