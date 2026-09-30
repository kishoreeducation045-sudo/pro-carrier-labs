import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import MarqueeTicker from "@/components/marketing/MarqueeTicker";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Clock, Star, Users, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export const revalidate = 60;

export default async function CourseCatalogPage() {
  const adminSupabase = await createAdminClient();

  const { data: courses } = await adminSupabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  const { data: settings } = await adminSupabase
    .from("site_settings")
    .select("key, value");

  const settingsMap = Object.fromEntries(
    (settings ?? []).map((s: any) => [s.key, s.value])
  );

  let tickerItems: string[] | undefined;
  try {
    tickerItems = settingsMap.ticker_items ? JSON.parse(settingsMap.ticker_items) : undefined;
  } catch {
    tickerItems = undefined;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <MarqueeTicker items={tickerItems} />
      <Navbar />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 4rem" }}>
          <span
            style={{
              background: "rgba(30, 111, 255, 0.12)",
              border: "1px solid rgba(30, 111, 255, 0.3)",
              color: "#60a5fa",
              fontSize: "0.8125rem",
              fontWeight: 800,
              padding: "0.375rem 1rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "1rem",
            }}
          >
            PROCAREERLABS MASTERCLASSES
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
            Upskill with Industry-Standard <span style={{ color: "#1e6fff" }}>AI & Career</span> Programs
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.125rem", lineHeight: 1.6, margin: 0 }}>
            Join over 12,000+ professionals learning directly from top creators and engineers. Practical, verified, and high-impact.
          </p>
        </div>

        {/* Courses Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
          {courses?.map((course: any) => {
            const features = Array.isArray(course.features) ? course.features : [];
            const discount = Math.round(((course.original_price_inr - course.price_inr) / course.original_price_inr) * 100);

            return (
              <div
                key={course.id}
                style={{
                  background: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 24,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <div>
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(30, 111, 255, 0.18), rgba(245, 166, 35, 0.08))",
                      padding: "2rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span
                        style={{
                          background: "rgba(245, 166, 35, 0.15)",
                          border: "1px solid rgba(245, 166, 35, 0.3)",
                          color: "#f5a623",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.625rem",
                          borderRadius: 9999,
                        }}
                      >
                        {course.category || "Artificial Intelligence"}
                      </span>
                      <span style={{ fontSize: "0.8125rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <Clock size={14} /> {course.course_duration_hours} Hours
                      </span>
                    </div>

                    <h2 style={{ fontSize: "1.375rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                      {course.title}
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "0.9375rem", margin: 0, lineHeight: 1.5 }}>
                      {course.headline || course.description}
                    </p>
                  </div>

                  <div style={{ padding: "2rem" }}>
                    {/* Key Highlights */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <p style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                        What you get:
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                        {features.slice(0, 4).map((feat: string, idx: number) => (
                          <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.875rem", color: "#cbd5e1" }}>
                            <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "0 2rem 2rem" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "1.875rem", fontWeight: 900, color: "#f9fafb" }}>
                      ₹{course.price_inr}
                    </span>
                    {course.original_price_inr && (
                      <span style={{ fontSize: "1rem", color: "#64748b", textDecoration: "line-through" }}>
                        ₹{course.original_price_inr}
                      </span>
                    )}
                    {discount > 0 && (
                      <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: 9999 }}>
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    style={{
                      width: "100%",
                      background: "#1e6fff",
                      color: "#fff",
                      padding: "0.9375rem",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 16px rgba(30, 111, 255, 0.3)",
                      transition: "all 0.2s",
                    }}
                  >
                    View Details & Enroll <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
