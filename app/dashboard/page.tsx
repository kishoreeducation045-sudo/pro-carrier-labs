import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient, getEffectiveUser } from "@/lib/supabase/server";
import StudentNavbar from "@/components/student/StudentNavbar";
import { BookOpen, Video, Award, ArrowRight, ShieldCheck, Clock, CheckCircle2, ReceiptText } from "lucide-react";

export const revalidate = 0; // Always fresh for student dashboard

export default async function DashboardPage() {
  const adminSupabase = await createAdminClient();
  const user = await getEffectiveUser();

  if (!user) {
    redirect("/login?next=/dashboard");
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

  // Fetch enrolled courses with course details
  const { data: enrollments } = await adminSupabase
    .from("enrollments")
    .select("*, courses(*), transactions(*)")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  // Fetch upcoming cohort details
  const { data: activeCohort } = await adminSupabase
    .from("cohort_settings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch certificates
  const { data: certificates } = await adminSupabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id);

  // Fetch transactions for UTR display
  const { data: transactions } = await adminSupabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const enrolledCount = enrollments?.length || 0;
  const certsCount = certificates?.length || 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <StudentNavbar studentName={studentName} studentId={studentId} role={profile?.role || "student"} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Top Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 111, 255, 0.15), rgba(245, 166, 35, 0.08))",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 24,
            padding: "2rem 2.5rem",
            marginBottom: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  background: "rgba(245, 166, 35, 0.15)",
                  border: "1px solid rgba(245, 166, 35, 0.35)",
                  color: "#f5a623",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "0.25rem 0.625rem",
                  borderRadius: 9999,
                  letterSpacing: "0.05em",
                }}
              >
                STUDENT PORTAL
              </span>
              <span style={{ color: "#64748b", fontSize: "0.875rem" }}>•</span>
              <span style={{ color: "#94a3b8", fontSize: "0.875rem", fontFamily: "monospace" }}>
                ID: <strong style={{ color: "#f9fafb" }}>{studentId}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
              Welcome back, <span style={{ color: "#1e6fff" }}>{studentName}</span> 👋
            </h1>
            <p style={{ color: "#94a3b8", margin: "0.5rem 0 0", fontSize: "0.95rem" }}>
              Access your enrolled masterclasses, live Zoom sessions, and credentials.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/courses"
              style={{
                background: "#1e6fff",
                color: "#ffffff",
                padding: "0.875rem 1.5rem",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.9375rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 20px rgba(30, 111, 255, 0.3)",
              }}
            >
              Browse Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 16,
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Enrolled Courses</span>
              <BookOpen size={20} color="#1e6fff" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f9fafb" }}>{enrolledCount}</div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.25rem 0 0" }}>Active memberships</p>
          </div>

          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 16,
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Certificates Earned</span>
              <Award size={20} color="#f5a623" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f9fafb" }}>{certsCount}</div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.25rem 0 0" }}>Verifiable credentials</p>
          </div>

          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 16,
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Live Masterclasses</span>
              <Video size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}>Active</div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.25rem 0 0" }}>Next cohort ready</p>
          </div>

          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 16,
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Verified Status</span>
              <ShieldCheck size={20} color="#60a5fa" />
            </div>
            <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f5a623", marginTop: "0.5rem" }}>
              {studentId}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#10b981", margin: "0.25rem 0 0" }}>✓ Lifetime Identity</p>
          </div>
        </div>

        {/* Live Cohort Card */}
        {activeCohort && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 111, 255, 0.1))",
              border: "1px solid rgba(30, 111, 255, 0.3)",
              borderRadius: 20,
              padding: "2rem",
              marginBottom: "2.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.75rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
                NEXT LIVE MASTERCLASS
              </div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
                {activeCohort.title}
              </h2>
              <div style={{ display: "flex", gap: "1.25rem", color: "#94a3b8", fontSize: "0.875rem", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Clock size={15} color="#f5a623" />
                  {new Date(activeCohort.cohort_date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span>•</span>
                <span>Duration: {activeCohort.duration_hours} Hours</span>
              </div>
            </div>

            <div>
              <a
                href={activeCohort.zoom_link || "https://zoom.us"}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#ffffff",
                  padding: "0.875rem 1.75rem",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  boxShadow: "0 4px 20px rgba(16, 185, 129, 0.35)",
                }}
              >
                <Video size={18} /> Join Zoom Class
              </a>
            </div>
          </div>
        )}

        {/* Enrolled Courses Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, margin: 0 }}>My Enrolled Courses</h2>
            <Link href="/my-courses" style={{ color: "#1e6fff", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
              View All ({enrolledCount}) →
            </Link>
          </div>

          {enrolledCount === 0 ? (
            <div
              style={{
                background: "rgba(17, 24, 39, 0.5)",
                border: "1px dashed rgba(255, 255, 255, 0.12)",
                borderRadius: 20,
                padding: "3rem 1.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem" }}>You haven't enrolled in any courses yet</h3>
              <p style={{ color: "#94a3b8", maxWidth: 450, margin: "0 auto 1.5rem", fontSize: "0.9375rem" }}>
                Explore our industry-leading live AI masterclasses and start your learning journey.
              </p>
              <Link
                href="/courses"
                style={{
                  background: "#1e6fff",
                  color: "#fff",
                  padding: "0.875rem 1.75rem",
                  borderRadius: 10,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Explore Courses Now
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {enrollments?.map((item: any) => {
                const course = item.courses;
                const progress = item.progress_percent || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 18,
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, background: "rgba(16, 185, 129, 0.15)", padding: "0.2rem 0.5rem", borderRadius: 6 }}>
                          Active Enrollment
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {course?.course_duration_hours || 3} Hours
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                        {course?.title || "AI Masterclass"}
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
                        {course?.headline || course?.description?.slice(0, 90) + "..."}
                      </p>
                    </div>

                    <div>
                      {/* Progress Bar */}
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.375rem" }}>
                          <span>Course Progress</span>
                          <span style={{ color: "#f5a623", fontWeight: 700 }}>{progress}%</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
                          <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #1e6fff, #f5a623)", borderRadius: 9999 }} />
                        </div>
                      </div>

                      <Link
                        href={`/courses/${course?.slug || "ai-masterclass"}/learn`}
                        style={{
                          background: "rgba(30, 111, 255, 0.15)",
                          border: "1px solid rgba(30, 111, 255, 0.3)",
                          color: "#60a5fa",
                          padding: "0.75rem",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s",
                        }}
                      >
                        Continue Learning <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transactions & Bank UTR Receipts Section */}
        {transactions && transactions.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ReceiptText size={20} color="#f5a623" /> Payment History & Razorpay UTR
            </h2>
            <div
              style={{
                background: "rgba(17, 24, 39, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#64748b" }}>
                    <th style={{ padding: "0.875rem 1.25rem" }}>Date</th>
                    <th style={{ padding: "0.875rem 1.25rem" }}>Student ID</th>
                    <th style={{ padding: "0.875rem 1.25rem" }}>Amount</th>
                    <th style={{ padding: "0.875rem 1.25rem" }}>Bank UTR / Ref ID</th>
                    <th style={{ padding: "0.875rem 1.25rem" }}>Razorpay Order</th>
                    <th style={{ padding: "0.875rem 1.25rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#94a3b8" }}>
                        {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#f5a623", fontFamily: "monospace" }}>
                        {tx.student_id_code || studentId}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#10b981" }}>
                        ₹{tx.amount_inr}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", fontFamily: "monospace", color: "#f9fafb" }}>
                        {tx.razorpay_utr_id || "UTR-VERIFIED"}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", fontFamily: "monospace", color: "#64748b", fontSize: "0.75rem" }}>
                        {tx.razorpay_order_id}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 4 }}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
