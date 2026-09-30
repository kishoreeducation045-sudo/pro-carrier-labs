"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const PAIN_POINTS = [
  "I feel stuck in my 9-to-5 with no side income",
  "I don't know how to use AI tools practically",
  "My LinkedIn profile gets zero views",
  "I want to upskill but don't know where to start",
  "I'm scared AI will replace my job",
  "I want to earn more without switching careers",
  "I spend hours on tasks AI could do in minutes",
  "I don't have a technical background",
  "I want to build a personal brand online",
  "I want to be more productive at work",
];

export default function PainPoints() {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1526 100%)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(30,111,255,0.1)",
              border: "1px solid rgba(30,111,255,0.25)",
              color: "#60a5fa",
              fontSize: "0.8125rem",
              fontWeight: 700,
              padding: "0.375rem 1rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Does This Sound Like You?
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              color: "#f9fafb",
              margin: "0 0 0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Click everything that applies to you
          </h2>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            {selected.size > 0
              ? `You selected ${selected.size} — this masterclass solves all of them.`
              : "Tap the cards below to see how many you relate to."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.875rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          {PAIN_POINTS.map((point, i) => {
            const isSelected = selected.has(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: 9999,
                  border: `1px solid ${isSelected ? "#1e6fff" : "rgba(255,255,255,0.1)"}`,
                  background: isSelected ? "rgba(30,111,255,0.15)" : "rgba(17,24,39,0.6)",
                  color: isSelected ? "#60a5fa" : "#94a3b8",
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                {isSelected && <CheckCircle2 size={16} color="#1e6fff" />}
                {point}
              </button>
            );
          })}
        </div>

        {selected.size >= 3 && (
          <div
            style={{
              textAlign: "center",
              background: "rgba(30,111,255,0.08)",
              border: "1px solid rgba(30,111,255,0.2)",
              borderRadius: 16,
              padding: "1.5rem",
              animation: "fade-up 0.4s ease",
            }}
          >
            <p style={{ color: "#f9fafb", fontWeight: 700, fontSize: "1.125rem", margin: "0 0 0.5rem" }}>
              🎯 This masterclass was built for you!
            </p>
            <p style={{ color: "#94a3b8", margin: "0 0 1rem" }}>
              Neeraj addresses every single one of these in 3 hours.
            </p>
            <a
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#1e6fff",
                color: "#fff",
                fontWeight: 700,
                padding: "0.875rem 2rem",
                borderRadius: 9999,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Reserve My Seat Now →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
