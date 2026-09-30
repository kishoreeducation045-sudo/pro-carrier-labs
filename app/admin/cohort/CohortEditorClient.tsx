"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Save, CheckCircle2, IndianRupee, Loader2 } from "lucide-react";

interface CohortEditorClientProps {
  initialCohort: any;
}

export default function CohortEditorClient({ initialCohort }: CohortEditorClientProps) {
  const router = useRouter();

  // Format initial ISO date for datetime-local input
  const defaultDateStr = initialCohort?.cohort_date
    ? new Date(initialCohort.cohort_date).toISOString().slice(0, 16)
    : new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16);

  const [form, setForm] = useState({
    id: initialCohort?.id || "",
    title: initialCohort?.title || "AI Masterclass with Neeraj Kumar",
    headline: initialCohort?.headline || "Build, Automate & Scale with Generative AI in 3 Hours",
    subheadline: initialCohort?.subheadline || "Join 12,000+ professionals mastering prompt engineering, autonomous agents & workflow automation.",
    cohort_date: defaultDateStr,
    duration_hours: initialCohort?.duration_hours || 3,
    max_seats: initialCohort?.max_seats || 100,
    seats_taken: initialCohort?.seats_taken || 87,
    price_inr: initialCohort?.price_inr || 299,
    original_price_inr: initialCohort?.original_price_inr || 2999,
    zoom_link: initialCohort?.zoom_link || "https://zoom.us/j/pcl-live-masterclass",
    is_active: initialCohort?.is_active ?? true,
    show_countdown: initialCohort?.show_countdown ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (k: string, val: any) => {
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/cohort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cohort_date: new Date(form.cohort_date).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update cohort");
      }

      setSuccessMsg("Cohort details updated successfully! Live homepage has been updated.");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {successMsg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#10b981",
            padding: "1rem 1.25rem",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            fontSize: "0.9375rem",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            padding: "1rem 1.25rem",
            borderRadius: 12,
            fontSize: "0.9375rem",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* General Info Card */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 1.5rem", color: "#f9fafb" }}>
          1. Headline & Copy
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Cohort Masterclass Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="input-field"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Primary Headline
            </label>
            <input
              type="text"
              required
              value={form.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              className="input-field"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Subheadline Description
            </label>
            <textarea
              rows={3}
              value={form.subheadline}
              onChange={(e) => handleChange("subheadline", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
                resize: "vertical",
              }}
            />
          </div>
        </div>
      </div>

      {/* Date, Time & Zoom Schedule */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 1.5rem", color: "#f9fafb", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={18} color="#f5a623" /> 2. Schedule & Zoom Meeting
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-two-col">
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Cohort Date & Start Time *
            </label>
            <input
              type="datetime-local"
              required
              value={form.cohort_date}
              onChange={(e) => handleChange("cohort_date", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Session Duration (Hours)
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={form.duration_hours}
              onChange={(e) => handleChange("duration_hours", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Live Zoom / Meeting Link (Shared with Enrolled Students)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="url"
                required
                value={form.zoom_link}
                onChange={(e) => handleChange("zoom_link", e.target.value)}
                placeholder="https://zoom.us/j/..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  color: "#fff",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Seats Controller */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 1.5rem", color: "#f9fafb", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IndianRupee size={18} color="#10b981" /> 3. Pricing & Seats Allocation
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-two-col">
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Offer Price (₹ INR)
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.price_inr}
              onChange={(e) => handleChange("price_inr", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#10b981",
                fontSize: "1.125rem",
                fontWeight: 700,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Original Strike Price (₹ INR)
            </label>
            <input
              type="number"
              min={0}
              value={form.original_price_inr}
              onChange={(e) => handleChange("original_price_inr", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#64748b",
                fontSize: "1.125rem",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Max Cohort Seats Limit
            </label>
            <input
              type="number"
              min={1}
              value={form.max_seats}
              onChange={(e) => handleChange("max_seats", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Seats Taken / Sold
            </label>
            <input
              type="number"
              min={0}
              value={form.seats_taken}
              onChange={(e) => handleChange("seats_taken", e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#f5a623",
                fontWeight: 700,
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
            padding: "1rem 2.5rem",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: "1rem",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            boxShadow: "0 0 25px rgba(30, 111, 255, 0.4)",
          }}
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save size={18} /> Save & Publish to Homepage
            </>
          )}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  );
}
