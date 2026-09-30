import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { createAdminClient } from "@/lib/supabase/server";
import EnrollButton from "./EnrollButton";
import { Clock, CheckCircle2, Shield, BookOpen } from "lucide-react";

export const revalidate = 60;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adminSupabase = await createAdminClient();

  const { data: course } = await adminSupabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) {
    notFound();
  }

  const features = Array.isArray(course.features) ? course.features : [];
  const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
  const discount = Math.round(
    ((course.original_price_inr - course.price_inr) / course.original_price_inr) * 100
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
        {/* Course Hero Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "3.5rem",
            alignItems: "start",
            marginBottom: "4rem",
          }}
          className="course-detail-grid"
        >
          {/* Left Column: Info & Curriculum */}
          <div>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <span
                style={{
                  background: "rgba(30, 111, 255, 0.15)",
                  border: "1px solid rgba(30, 111, 255, 0.3)",
                  color: "#60a5fa",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                  textTransform: "uppercase",
                }}
              >
                {course.category}
              </span>
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                }}
              >
                Verified Certification
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
              {course.title}
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1.125rem", lineHeight: 1.6, margin: "0 0 2rem" }}>
              {course.headline || course.description}
            </p>

            {/* Quick Meta Strip */}
            <div
              style={{
                display: "flex",
                gap: "2rem",
                padding: "1.25rem",
                background: "rgba(17, 24, 39, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                marginBottom: "2.5rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Duration</div>
                <div style={{ fontWeight: 700, color: "#f9fafb", marginTop: 2 }}>{course.course_duration_hours} Hours Live & Interactive</div>
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Difficulty</div>
                <div style={{ fontWeight: 700, color: "#f5a623", marginTop: 2 }}>{course.difficulty_level}</div>
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Access</div>
                <div style={{ fontWeight: 700, color: "#10b981", marginTop: 2 }}>Lifetime + Updates</div>
              </div>
            </div>

            {/* Curriculum Roadmap */}
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={22} color="#1e6fff" /> Comprehensive Curriculum
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {curriculum.map((mod: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 14,
                      padding: "1.25rem 1.5rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#f5a623", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {mod.module || `Module ${idx + 1}`}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{mod.duration}</span>
                    </div>
                    <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                      {mod.title}
                    </h3>
                    {Array.isArray(mod.topics) && (
                      <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem", color: "#94a3b8", fontSize: "0.875rem" }}>
                        {mod.topics.map((t: string, tidx: number) => (
                          <li key={tidx} style={{ marginBottom: 4 }}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Spotlight */}
            <div
              style={{
                background: "rgba(17, 24, 39, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 20,
                padding: "2rem",
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", position: "relative", border: "2px solid #1e6fff" }}>
                <Image src="/neeraj-suit.jpg" alt="Neeraj Kumar" fill style={{ objectFit: "cover" }} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.2rem", fontWeight: 800 }}>Taught by Neeraj Kumar</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#60a5fa", fontSize: "0.875rem", fontWeight: 600 }}>
                  Lead AI Architect & Top Industry Mentor
                </p>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.5, maxWidth: 500 }}>
                  Having trained 12,000+ professionals, Neeraj focuses on practical implementations, autonomous agent pipelines, and enterprise automation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Checkout Card */}
          <div style={{ position: "sticky", top: 100 }}>
            <div
              style={{
                background: "rgba(17, 24, 39, 0.95)",
                border: "1px solid rgba(30, 111, 255, 0.3)",
                borderRadius: 24,
                padding: "2.5rem",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(30, 111, 255, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "2.75rem", fontWeight: 900, color: "#f9fafb" }}>
                  ₹{course.price_inr}
                </span>
                {course.original_price_inr && (
                  <span style={{ fontSize: "1.25rem", color: "#64748b", textDecoration: "line-through" }}>
                    ₹{course.original_price_inr}
                  </span>
                )}
                {discount > 0 && (
                  <span style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", fontSize: "0.8125rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999 }}>
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p style={{ color: "#f5a623", fontSize: "0.8125rem", fontWeight: 700, margin: "0 0 1.5rem" }}>
                🔥 Limited time cohort pricing · Direct Razorpay Instant Activation
              </p>

              {/* Client interactive Enroll Button with Razorpay modal */}
              <EnrollButton courseId={course.id} courseTitle={course.title} price={course.price_inr} />

              <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", margin: "1.5rem 0" }} />

              <div>
                <p style={{ color: "#f9fafb", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                  What's included in your access:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {features.map((feat: string, idx: number) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "#cbd5e1" }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "#cbd5e1" }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Official ProCareerLabs Verifiable Certificate</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "#cbd5e1" }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Razorpay Instant UTR Receipt & Student Credential</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.8125rem" }}>
                <Shield size={15} color="#10b981" /> 100% Secure 256-Bit Razorpay Payments
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .course-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
