import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient, getEffectiveUser } from "@/lib/supabase/server";
import StudentNavbar from "@/components/student/StudentNavbar";
import { BookOpen, PlayCircle, Award, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function MyCoursesPage() {
  const adminSupabase = await createAdminClient();
  const user = await getEffectiveUser();

  if (!user) {
    redirect("/login?next=/my-courses");
  }

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

  const { data: enrollments } = await adminSupabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <StudentNavbar studentName={studentName} studentId={studentId} role={profile?.role || "student"} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
            My Courses & Certifications
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", margin: 0 }}>
            Continue learning, watch recorded modules, and complete quizzes to earn certificates.
          </p>
        </div>

        {(!enrollments || enrollments.length === 0) ? (
          <div
            style={{
              background: "rgba(17, 24, 39, 0.6)",
              border: "1px dashed rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📚</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem" }}>No active courses found</h2>
            <p style={{ color: "#94a3b8", maxWidth: 450, margin: "0 auto 1.5rem", fontSize: "0.95rem" }}>
              Unlock practical AI and career skills today with our verified masterclasses.
            </p>
            <Link
              href="/courses"
              style={{
                background: "#1e6fff",
                color: "#fff",
                padding: "0.875rem 2rem",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
            {enrollments.map((item: any) => {
              const course = item.courses;
              const progress = item.progress_percent || 0;
              const isCompleted = progress >= 100 || item.status === "completed";

              return (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(17, 24, 39, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 20,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(30, 111, 255, 0.2), rgba(245, 166, 35, 0.1))",
                      padding: "2rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span
                        style={{
                          background: isCompleted ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 111, 255, 0.2)",
                          color: isCompleted ? "#10b981" : "#60a5fa",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.625rem",
                          borderRadius: 9999,
                        }}
                      >
                        {isCompleted ? "✓ Completed" : "In Progress"}
                      </span>
                      <span style={{ fontSize: "0.8125rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <Clock size={14} /> {course?.course_duration_hours || 3}h
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                      {course?.title || "AI Masterclass"}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                      {course?.headline || course?.description?.slice(0, 100)}
                    </p>
                  </div>

                  <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "0.5rem" }}>
                        <span style={{ color: "#94a3b8" }}>Progress</span>
                        <span style={{ color: "#f5a623", fontWeight: 700 }}>{progress}%</span>
                      </div>
                      <div style={{ width: "100%", height: 8, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #1e6fff, #10b981)", borderRadius: 9999 }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <Link
                        href={`/courses/${course?.slug || "ai-masterclass"}/learn`}
                        style={{
                          flex: 1,
                          background: "#1e6fff",
                          color: "#fff",
                          padding: "0.875rem",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <PlayCircle size={18} /> {progress > 0 ? "Continue" : "Start Course"}
                      </Link>

                      {isCompleted && (
                        <Link
                          href="/certificates"
                          style={{
                            background: "rgba(245, 166, 35, 0.15)",
                            border: "1px solid rgba(245, 166, 35, 0.4)",
                            color: "#f5a623",
                            padding: "0.875rem 1rem",
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                          }}
                        >
                          <Award size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
