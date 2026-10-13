"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, Loader2, Sliders, Sparkles, MessageSquare, TrendingUp } from "lucide-react";

interface SiteTickerTabProps {
  initialSettings: Record<string, string>;
}

export default function SiteTickerTab({ initialSettings }: SiteTickerTabProps) {
  const router = useRouter();

  let defaultTickerStr = "";
  try {
    const parsed = initialSettings.ticker_items ? JSON.parse(initialSettings.ticker_items) : null;
    defaultTickerStr = Array.isArray(parsed)
      ? parsed.join("\n")
      : "🎁 5 Free Bonuses worth ₹23,500+ included\n👥 12,000+ Working Professionals Trained\n⭐ 4.9/5 Rating from 15,000+ Alumni\n🔥 Only 13 seats remaining for upcoming cohort!\n⏰ Limited Offer — Price resets to ₹2,999 soon";
  } catch {
    defaultTickerStr =
      "🎁 5 Free Bonuses worth ₹23,500+ included\n👥 12,000+ Working Professionals Trained\n⭐ 4.9/5 Rating from 15,000+ Alumni";
  }

  const [tickerText, setTickerText] = useState(defaultTickerStr);
  const [students, setStudents] = useState(initialSettings.stat_students || "12,000+");
  const [workshops, setWorkshops] = useState(initialSettings.stat_workshops || "150+");
  const [rating, setRating] = useState(initialSettings.stat_rating || "4.9/5");
  const [revenue, setRevenue] = useState(initialSettings.stat_revenue || "₹2.4 Cr+");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErrorMsg("");

    const tickerItems = tickerText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            { key: "ticker_items", value: JSON.stringify(tickerItems), label: "Ticker bar items" },
            { key: "stat_students", value: students, label: "Students trained count" },
            { key: "stat_workshops", value: workshops, label: "Workshops conducted" },
            { key: "stat_rating", value: rating, label: "Average rating" },
            { key: "stat_revenue", value: revenue, label: "Client revenue unlocked" },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setMsg("Site metrics & marquee ticker saved successfully! Live website updated.");
      router.refresh();
      setTimeout(() => setMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {msg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#10b981",
            padding: "1rem 1.25rem",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            fontWeight: 600,
            fontSize: "0.9375rem",
          }}
        >
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#ef4444",
            padding: "1rem 1.25rem",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            fontWeight: 600,
            fontSize: "0.9375rem",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* 1. Ticker Items */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
          <span
            style={{
              background: "rgba(30,111,255,0.15)",
              color: "#60a5fa",
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Announcement Bar
          </span>
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
          1. Homepage Marquee Ticker Items
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
          Enter one ticker notification per line. These announcements scroll across the high-visibility marquee ticker on the homepage.
        </p>

        <textarea
          rows={6}
          value={tickerText}
          onChange={(e) => setTickerText(e.target.value)}
          placeholder="🎁 5 Free Bonuses worth ₹23,500+ included&#10;👥 12,000+ Working Professionals Trained"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "1rem",
            color: "#fff",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
        <div style={{ marginTop: "0.5rem", color: "#64748b", fontSize: "0.8125rem" }}>
          💡 Tip: You can include emojis (e.g. 🎁, 🔥, ⭐, 👥) to make ticker announcements stand out.
        </div>
      </div>

      {/* 2. Social Proof Stats */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
          <span
            style={{
              background: "rgba(245,166,35,0.15)",
              color: "#f5a623",
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Social Proof
          </span>
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
          2. Social Proof & Authority Numbers
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
          Update the trust metrics displayed across the homepage, stats section, and credibility banners.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Students Trained (e.g. 12,000+)
            </label>
            <input
              type="text"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Workshops Conducted (e.g. 150+)
            </label>
            <input
              type="text"
              value={workshops}
              onChange={(e) => setWorkshops(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Average Rating (e.g. 4.9/5)
            </label>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#f5a623",
                fontWeight: 700,
                fontSize: "0.9375rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Client Revenue Unlocked (e.g. ₹2.4 Cr+)
            </label>
            <input
              type="text"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#10b981",
                fontWeight: 700,
                fontSize: "0.9375rem",
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            background: "linear-gradient(135deg, #1e6fff, #1658d4)",
            color: "#ffffff",
            padding: "0.875rem 2.25rem",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: "0.9375rem",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            boxShadow: "0 4px 14px rgba(30,111,255,0.35)",
            opacity: saving ? 0.7 : 1,
            transition: "all 0.15s ease",
          }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving Settings..." : "Save Site & Ticker Settings"}
        </button>
      </div>
    </form>
  );
}
