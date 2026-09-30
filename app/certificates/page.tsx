import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient, getEffectiveUser } from "@/lib/supabase/server";
import StudentNavbar from "@/components/student/StudentNavbar";
import { Award, Download, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function CertificatesPage() {
  const adminSupabase = await createAdminClient();
  const user = await getEffectiveUser();

  if (!user) {
    redirect("/login?next=/certificates");
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

  const { data: certificates } = await adminSupabase
    .from("certificates")
    .select("*, courses(*)")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <StudentNavbar studentName={studentName} studentId={studentId} role={profile?.role || "student"} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 166, 35, 0.15)", border: "1px solid rgba(245, 166, 35, 0.3)", color: "#f5a623", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.75rem" }}>
            <Award size={14} /> OFFICIAL CREDENTIALS
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
            My Verified Certificates
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", margin: 0 }}>
            Official certificates awarded for mastering courses on ProCareerLabs. Shareable on LinkedIn & Resumes.
          </p>
        </div>

        {(!certificates || certificates.length === 0) ? (
          <div
            style={{
              background: "rgba(17, 24, 39, 0.6)",
              border: "1px dashed rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🏅</div>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, margin: "0 0 0.5rem" }}>No certificates issued yet</h2>
            <p style={{ color: "#94a3b8", maxWidth: 450, margin: "0 auto 1.5rem", fontSize: "0.9375rem" }}>
              Complete 100% of your course modules and quizzes to automatically generate your verified certificate of completion.
            </p>
            <Link
              href="/my-courses"
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
              Go to My Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
            {certificates.map((cert: any) => {
              const issueDate = new Date(cert.issued_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={cert.id}
                  style={{
                    background: "rgba(17, 24, 39, 0.9)",
                    border: "1px solid rgba(245, 166, 35, 0.3)",
                    borderRadius: 20,
                    padding: "2rem",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 25px rgba(245, 166, 35, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <ShieldCheck size={16} /> Verified Credential
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{issueDate}</span>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                      {cert.course_title || cert.courses?.title || "Masterclass"}
                    </h3>

                    <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 10, padding: "0.75rem 1rem", margin: "1rem 0" }}>
                      <span style={{ fontSize: "0.6875rem", color: "#64748b", textTransform: "uppercase", display: "block" }}>Recipient</span>
                      <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f9fafb" }}>{cert.student_name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#f5a623", fontFamily: "monospace", display: "block", marginTop: 2 }}>{studentId}</span>
                    </div>

                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                      Verification ID: <span style={{ color: "#f5a623", fontFamily: "monospace", fontWeight: 700 }}>{cert.certificate_code}</span>
                    </div>
                  </div>

                  <a
                    href={`/api/certificates/${cert.id}`}
                    download
                    style={{
                      background: "linear-gradient(135deg, #f5a623, #d97706)",
                      color: "#0a0f1e",
                      padding: "0.875rem",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Download size={16} /> Download PDF Certificate
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
