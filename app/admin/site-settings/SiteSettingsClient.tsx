"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, Loader2 } from "lucide-react";

interface SiteSettingsClientProps {
  initialSettings: Record<string, string>;
}

export default function SiteSettingsClient({ initialSettings }: SiteSettingsClientProps) {
  const router = useRouter();

  let defaultTickerStr = "";
  try {
    const parsed = initialSettings.ticker_items ? JSON.parse(initialSettings.ticker_items) : null;
    defaultTickerStr = Array.isArray(parsed)
      ? parsed.join("\n")
      : "🎁 5 Free Bonuses worth ₹23,500+ included\n👥 12,000+ Working Professionals Trained\n⭐ 4.9/5 Rating from 15,000+ Alumni\n🔥 Only 13 seats remaining for upcoming cohort!\n⏰ Limited Offer — Price resets to ₹2,999 soon";
  } catch {
    defaultTickerStr = "🎁 5 Free Bonuses worth ₹23,500+ included\n👥 12,000+ Working Professionals Trained\n⭐ 4.9/5 Rating from 15,000+ Alumni";
  }

  const [tickerText, setTickerText] = useState(defaultTickerStr);
  const [students, setStudents] = useState(initialSettings.stat_students || "12,000+");
  const [workshops, setWorkshops] = useState(initialSettings.stat_workshops || "150+");
  const [rating, setRating] = useState(initialSettings.stat_rating || "4.9/5");
  const [revenue, setRevenue] = useState(initialSettings.stat_revenue || "₹2.4 Cr+");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

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

      setMsg("Site metrics & ticker updated successfully! Refreshing homepage.");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {msg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", padding: "1rem", borderRadius: 12, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {/* Ticker Items */}
      <div style={{ background: "rgba(17, 24, 39, 0.85)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 20, padding: "2rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
          1. Homepage Marquee Ticker Items
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.25rem" }}>
          Enter one ticker notification per line. These scroll across the top bar on the homepage.
        </p>

        <textarea
          rows={6}
          value={tickerText}
          onChange={(e) => setTickerText(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0.875rem 1rem", color: "#fff", lineHeight: 1.6 }}
        />
      </div>

      {/* Social Proof Stats */}
      <div style={{ background: "rgba(17, 24, 39, 0.85)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 20, padding: "2rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 1.5rem" }}>
          2. Social Proof & Authority Numbers
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Students Trained (e.g. 12,000+)
            </label>
            <input
              type="text"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0.75rem 1rem", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Workshops Conducted (e.g. 150+)
            </label>
            <input
              type="text"
              value={workshops}
              onChange={(e) => setWorkshops(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0.75rem 1rem", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Average Rating (e.g. 4.9/5)
            </label>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0.75rem 1rem", color: "#f5a623", fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Client Revenue Unlocked (e.g. ₹2.4 Cr+)
            </label>
            <input
              type="text"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0.75rem 1rem", color: "#10b981", fontWeight: 700 }}
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
            padding: "1rem 2.5rem",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: "1rem",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
          }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save All Site Settings
        </button>
      </div>
    </form>
  );
}
