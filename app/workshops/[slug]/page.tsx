import { notFound } from "next/navigation";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { createAdminClient } from "@/lib/supabase/server";
import WorkshopEnrollButton from "./WorkshopEnrollButton";
import { Clock, CheckCircle2, Shield, Calendar, Users, Award, Zap } from "lucide-react";

export const revalidate = 60;

interface CurriculumModule {
  title?: string;
  description?: string;
  duration_minutes?: number;
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adminSupabase = await createAdminClient();

  const { data: workshop } = await adminSupabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!workshop) {
    notFound();
  }

  const features = Array.isArray(workshop.features) ? workshop.features : [];
  const curriculum = (Array.isArray(workshop.curriculum) ? workshop.curriculum : []) as CurriculumModule[];
  const originalPrice = workshop.original_price_inr || 2999;
  const discount = Math.round(
    ((originalPrice - workshop.price_inr) / originalPrice) * 100
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
        {/* Workshop Hero Grid */}
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
                {workshop.category || "Live Workshop"}
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
                ● Interactive Live Masterclass
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
              {workshop.title}
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1.125rem", lineHeight: 1.6, margin: "0 0 2rem" }}>
              {workshop.headline || workshop.description}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={18} color="#1e6fff" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Duration</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f9fafb" }}>
                    {workshop.course_duration_hours} Hours Live
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={18} color="#f5a623" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Audience</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f9fafb" }}>
                    {workshop.difficulty_level || "All Professionals"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={18} color="#10b981" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Format</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f9fafb" }}>
                    Live on Zoom + WhatsApp Community
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn / Features */}
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#f9fafb" }}>
                What&apos;s Included in this Workshop
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {features.map((feat: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      background: "rgba(17, 24, 39, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: 12,
                      padding: "1rem",
                    }}
                  >
                    <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: "0.9375rem", color: "#cbd5e1", lineHeight: 1.5 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum breakdown if present */}
            {curriculum.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#f9fafb" }}>
                  Workshop Agenda & Modules
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {curriculum.map((mod: CurriculumModule, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(17, 24, 39, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 12,
                        padding: "1rem 1.25rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ background: "rgba(30,111,255,0.15)", color: "#60a5fa", width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8125rem", fontWeight: 800 }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <p style={{ color: "#f9fafb", fontWeight: 700, margin: 0, fontSize: "0.9375rem" }}>
                            {mod.title}
                          </p>
                          {mod.description && (
                            <p style={{ color: "#64748b", margin: 0, fontSize: "0.8125rem" }}>
                              {mod.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>
                        {mod.duration_minutes ? `${mod.duration_minutes}m` : "Live"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Pricing & Enrollment Card */}
          <div style={{ position: "sticky", top: 100 }}>
            <div
              style={{
                background: "rgba(17, 24, 39, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 24,
                padding: "2rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Price Row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#f9fafb" }}>
                  ₹{workshop.price_inr}
                </span>
                <span style={{ fontSize: "1.25rem", color: "#64748b", textDecoration: "line-through" }}>
                  ₹{originalPrice}
                </span>
                {discount > 0 && (
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#10b981",
                      fontSize: "0.875rem",
                      fontWeight: 800,
                      padding: "0.25rem 0.625rem",
                      borderRadius: 9999,
                    }}
                  >
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
                One-time ticket for live workshop access & all bonus materials.
              </p>

              {/* Enroll Button with Direct Student Registration */}
              <WorkshopEnrollButton
                workshopId={workshop.id}
                workshopTitle={workshop.title}
                price={workshop.price_inr}
              />

              {/* Trust Indicators */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#94a3b8" }}>
                  <Shield size={16} color="#10b981" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#94a3b8" }}>
                  <Calendar size={16} color="#f5a623" />
                  <span>Calendar Invite + WhatsApp Reminders sent instantly</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#94a3b8" }}>
                  <Zap size={16} color="#1e6fff" />
                  <span>No login required — instant seat registration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
