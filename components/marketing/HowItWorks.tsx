"use client";
import { UserCheck, BookOpen, Award } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: <UserCheck size={28} />,
    title: "Sign Up & Choose Your Course",
    description:
      "Create your free ProCareerLabs account in 30 seconds. Browse our expert-led courses and pick the one that matches your career goals.",
  },
  {
    step: "02",
    icon: <BookOpen size={28} />,
    title: "Enroll & Join Live Sessions",
    description:
      "Pay securely via UPI, card, or netbanking. Get instant access to materials and join live Zoom sessions with Neeraj and the cohort.",
  },
  {
    step: "03",
    icon: <Award size={28} />,
    title: "Complete & Get Certified",
    description:
      "Work through content at your pace, attend live Q&As, and receive your verified certificate upon completion. Apply your skills immediately.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "5rem 1.5rem" }}>
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
            Simple Process
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              color: "#f9fafb",
              margin: "0",
              letterSpacing: "-0.02em",
            }}
          >
            How It Works
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            position: "relative",
          }}
        >
          {/* Connector line (desktop only) */}
          <div
            style={{
              position: "absolute",
              top: 56,
              left: "16.66%",
              right: "16.66%",
              height: 1,
              background: "linear-gradient(90deg, rgba(30,111,255,0.3), rgba(245,166,35,0.3))",
              zIndex: 0,
            }}
            className="hidden md:block"
          />

          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                background: "rgba(17,24,39,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20,
                padding: "2.5rem 2rem",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,111,255,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(30,111,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#f5a623",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                }}
              >
                STEP {step.step}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg, rgba(30,111,255,0.15), rgba(245,166,35,0.1))",
                  border: "1px solid rgba(30,111,255,0.2)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  color: "#1e6fff",
                }}
              >
                {step.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "#f9fafb",
                  margin: "0 0 0.75rem",
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9375rem", margin: 0, lineHeight: 1.7 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
