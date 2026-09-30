import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function InstructorSection() {
  const credentials = [
    "LinkedIn Top Voice with 150K+ followers",
    "Built 9+ AI-powered workflows used daily by enterprise teams",
    "Featured speaker at 150+ corporate AI workshops",
    "Helped 500+ professionals land jobs & promotions using AI + LinkedIn",
    "10+ years of training experience in tech & people skills",
  ];

  const stats = [
    { value: "12K+", label: "Trained" },
    { value: "150+", label: "Workshops" },
    { value: "4.9★", label: "Avg Rating" },
  ];

  return (
    <section
      id="instructor"
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(245,166,35,0.1)",
              border: "1px solid rgba(245,166,35,0.25)",
              color: "#f5a623",
              fontSize: "0.8125rem",
              fontWeight: 700,
              padding: "0.375rem 1rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Your Instructor
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              color: "#f9fafb",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Meet Neeraj Kumar
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="instructor-grid"
        >
          {/* Photo */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 60px rgba(30,111,255,0.1)",
              }}
            >
              <Image
                src="/neeraj-suit.jpg"
                alt="Neeraj Kumar - Trainer & LinkedIn Influencer"
                width={500}
                height={600}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "rgba(17,24,39,0.8)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#1e6fff", fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>
                    {stat.value}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "0.75rem", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "1.0625rem", margin: 0, lineHeight: 1.7 }}>
              Neeraj Kumar is India's leading AI & LinkedIn growth strategist. He has trained over{" "}
              <strong style={{ color: "#f9fafb" }}>12,000 working professionals</strong> across the
              country to leverage AI tools and LinkedIn to build income streams — without writing a
              single line of code.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {credentials.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: "#94a3b8", fontSize: "0.9375rem", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                background: "#1e6fff",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "1rem 2rem",
                borderRadius: 9999,
                textDecoration: "none",
                alignSelf: "flex-start",
                boxShadow: "0 0 24px rgba(30,111,255,0.3)",
                transition: "all 0.2s",
              }}
            >
              Learn from Neeraj <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .instructor-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
