import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import StudentNavbar from "@/components/student/StudentNavbar";
import CoursePlayerClient from "./CoursePlayerClient";
import { ArrowLeft, Video } from "lucide-react";

export const revalidate = 0;

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/courses/${slug}/learn`);
  }

  // Fetch user profile & student profile
  const { data: profile } = await adminSupabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: studentProfile } = await adminSupabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const studentName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner";
  const studentId = studentProfile?.student_id || `PCL-${new Date().getFullYear()}-01001`;

  // Fetch course
  const { data: course } = await adminSupabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) {
    notFound();
  }

  // Check enrollment
  const { data: enrollment } = await adminSupabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  // If not enrolled and not admin, redirect to course page
  const isAdmin = ["admin", "super_admin"].includes(profile?.role);
  if (!enrollment && !isAdmin) {
    redirect(`/courses/${slug}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <StudentNavbar studentName={studentName} studentId={studentId} role={profile?.role || "student"} />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/my-courses"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              color: "#94a3b8",
              fontSize: "0.875rem",
              textDecoration: "none",
              marginBottom: "0.5rem",
            }}
          >
            <ArrowLeft size={16} /> Back to My Courses
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
              {course.title}
            </h1>
            {course.zoom_link && (
              <a
                href={course.zoom_link}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#10b981",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Video size={16} /> Live Masterclass Zoom Room
              </a>
            )}
          </div>
        </div>

        {/* Client Interactive Course Player */}
        <CoursePlayerClient
          course={course}
          initialProgress={enrollment?.progress_percent || 0}
        />
      </main>
    </div>
  );
}
