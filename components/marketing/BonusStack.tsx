"use client";

const BONUSES = [
  {
    title: "AI Niche Goldmine Guide",
    description: "100+ AI-powered business niches you can start today with zero investment.",
    value: 5000,
  },
  {
    title: "200+ Power Prompts Vault",
    description: "Ready-to-use ChatGPT and Gemini prompts for content, emails, reports, and more.",
    value: 6000,
  },
  {
    title: "Pro Agent Templates Pack",
    description: "Pre-built AI agent templates for automating your workflow — copy, paste, profit.",
    value: 4000,
  },
  {
    title: "LinkedIn SEO Formula Pack",
    description: "The exact keyword and optimization strategy that grew Neeraj's profile 8x in 30 days.",
    value: 3500,
  },
  {
    title: "Private WhatsApp Community + Certificate",
    description: "Get 24/7 support, accountability, and networking with 1000+ AI-powered professionals.",
    value: 5000,
  },
];

interface BonusItem {
  title: string;
  description: string;
  value: number;
}

interface BonusStackProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  bonuses?: BonusItem[];
}

export default function BonusStack({
  badge,
  title,
  subtitle,
  bonuses,
}: BonusStackProps = {}) {
  const displayBonuses = Array.isArray(bonuses) && bonuses.length > 0 ? bonuses : BONUSES;
  const displayBadge = badge || "Free Bonuses";
  const displaySubtitle = subtitle || "Reserve your seat and these are yours — instantly.";
  const totalValue = displayBonuses.reduce((sum, b) => sum + (Number(b.value) || 0), 0);

  const renderTitle = () => {
    if (title) {
      const parts = title.split(/(₹[0-9,kKmM+]+)/g);
      if (parts.length > 1) {
        return (
          <>
            {parts.map((part, idx) =>
              part.startsWith("₹") ? (
                <span
                  key={idx}
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #fbbf24)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </>
        );
      }
      return title;
    }
    return (
      <>
        Unlock {displayBonuses.length} Free Bonuses Worth{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #f5a623, #fbbf24)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ₹{totalValue.toLocaleString("en-IN")}+
        </span>
      </>
    );
  };

  return (
    <section
      id="bonuses"
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(245,166,35,0.1)",
              border: "1px solid rgba(245,166,35,0.3)",
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
            {displayBadge}
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
            {renderTitle()}
          </h2>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            {displaySubtitle}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {displayBonuses.map((bonus, i) => (
            <div
              key={i}
              className="bonus-card-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                background: "rgba(17,24,39,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "1.25rem 1.5rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,111,255,0.3)";
                (e.currentTarget as HTMLElement).style.background = "rgba(30,111,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(17,24,39,0.8)";
              }}
            >
              {/* Icon with dark background */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  background: "rgba(10, 15, 30, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/bluegiftbox.png"
                  alt="Bonus Gift Icon"
                  style={{
                    width: 34,
                    height: 34,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#f9fafb", fontWeight: 700, margin: "0 0 0.25rem", fontSize: "1rem" }}>
                  {bonus.title}
                </p>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
                  {bonus.description}
                </p>
              </div>

              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <p style={{ color: "#64748b", fontSize: "0.75rem", textDecoration: "line-through", margin: "0 0 2px" }}>
                  ₹{bonus.value.toLocaleString("en-IN")}
                </p>
                <p
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10b981",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: 9999,
                    margin: 0,
                    display: "inline-block",
                  }}
                >
                  FREE
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="bonus-total-card"
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem 1.5rem",
            background: "linear-gradient(135deg, rgba(245,166,35,0.08), rgba(30,111,255,0.06))",
            border: "1px solid rgba(245,166,35,0.2)",
            borderRadius: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#f9fafb", fontWeight: 700, fontSize: "1rem" }}>
            Total Value of All Bonuses
          </span>
          <span style={{ color: "#f5a623", fontWeight: 900, fontSize: "1.5rem" }}>
            ₹{totalValue.toLocaleString("en-IN")}+
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .bonus-card-item {
            padding: 1rem 0.85rem !important;
            gap: 0.85rem !important;
          }
          .bonus-total-card {
            flex-direction: column !important;
            gap: 0.5rem !important;
            text-align: center !important;
            padding: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
