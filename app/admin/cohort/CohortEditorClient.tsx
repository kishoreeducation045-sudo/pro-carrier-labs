"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Save,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Plus,
  BarChart3,
  Type,
} from "lucide-react";
import { formatGoogleDriveUrl } from "@/lib/utils";

interface CohortEditorClientProps {
  initialCohort: any;
  initialSettings: Record<string, string>;
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "0.75rem 1rem",
  color: "#fff",
  fontSize: "0.9375rem",
  outline: "none",
  boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  color: "#94a3b8",
  fontSize: "0.8125rem",
  fontWeight: 600,
  marginBottom: "0.375rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const CARD_STYLE: React.CSSProperties = {
  background: "rgba(17, 24, 39, 0.85)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 20,
  padding: "2rem",
};

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 800,
  margin: "0 0 1.5rem",
  color: "#f9fafb",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export default function CohortEditorClient({
  initialCohort,
  initialSettings,
}: CohortEditorClientProps) {
  const router = useRouter();

  // ---------- Cohort (schedule + pricing) state ----------
  const defaultDateStr = initialCohort?.cohort_date
    ? new Date(initialCohort.cohort_date).toISOString().slice(0, 16)
    : new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16);

  const [cohort, setCohort] = useState({
    id: initialCohort?.id || "",
    title: initialCohort?.title || "AI Masterclass with Neeraj Kumar",
    headline: initialCohort?.headline || "Build, Automate & Scale with Generative AI in 3 Hours",
    subheadline:
      initialCohort?.subheadline ||
      "Join 12,000+ professionals mastering prompt engineering, autonomous agents & workflow automation.",
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

  // ---------- Hero section content state ----------
  const [hero, setHero] = useState({
    hero_headline: initialSettings.hero_headline || "",
    hero_subheadline: initialSettings.hero_subheadline || "",
    hero_badge_text: initialSettings.hero_badge_text || "",
    hero_cta_text: initialSettings.hero_cta_text || "",
    hero_rating_value: initialSettings.hero_rating_value || "4.9",
    hero_rating_label: initialSettings.hero_rating_label || "Avg Rating",
    hero_students_count: initialSettings.hero_students_count || "12K+",
    hero_students_label: initialSettings.hero_students_label || "Professionals Trained",
  });

  // ---------- Hero image state ----------
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings.hero_image_url || "");
  const [imageInput, setImageInput] = useState(initialSettings.hero_image_url || "");
  const [imagePreview, setImagePreview] = useState(
    initialSettings.hero_image_url ? formatGoogleDriveUrl(initialSettings.hero_image_url) : ""
  );

  // ---------- Stats state ----------
  const [stats, setStats] = useState({
    stat1_value: initialSettings.stat1_value || "12K+",
    stat1_label: initialSettings.stat1_label || "Professionals Trained Across India",
    stat2_value: initialSettings.stat2_value || "150+",
    stat2_label: initialSettings.stat2_label || "Corporate AI Workshops Delivered",
    stat3_value: initialSettings.stat3_value || "4.9★",
    stat3_label: initialSettings.stat3_label || "Average Rating from Students",
    stat4_value: initialSettings.stat4_value || "10 hrs / wk",
    stat4_label: initialSettings.stat4_label || "Avg Time Saved After Class",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ---------- Handlers ----------
  const updateHero = (k: string, v: string) => setHero((h) => ({ ...h, [k]: v }));
  const updateStats = (k: string, v: string) => setStats((s) => ({ ...s, [k]: v }));
  const updateCohort = (k: string, v: any) => setCohort((c) => ({ ...c, [k]: v }));

  const handlePreviewImage = () => {
    if (!imageInput.trim()) return;
    const converted = formatGoogleDriveUrl(imageInput.trim());
    setImagePreview(converted);
    setHeroImageUrl(imageInput.trim()); // store raw url; convert on display
  };

  const handleDeleteImage = () => {
    setImageInput("");
    setImagePreview("");
    setHeroImageUrl("");
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
          // Cohort settings
          ...cohort,
          cohort_date: new Date(cohort.cohort_date).toISOString(),
          // Hero + Stats as site_settings
          siteSettings: {
            ...hero,
            hero_image_url: heroImageUrl,
            ...stats,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setSuccessMsg("All changes saved and published to the live homepage!");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Alerts */}
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

      {/* ── SECTION 1: Hero Copy ── */}
      <div style={CARD_STYLE}>
        <h2 style={SECTION_TITLE_STYLE}>
          <Type size={18} color="#60a5fa" /> 1. Hero Section — Text Copy
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.8125rem", margin: "0 0 1.5rem" }}>
          Leave any field blank to use the built-in default text.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={LABEL_STYLE}>Live Badge Text (e.g. &quot;Live Cohort • 15th November&quot;)</label>
            <input
              type="text"
              placeholder="Live Cohort • 15th November"
              value={hero.hero_badge_text}
              onChange={(e) => updateHero("hero_badge_text", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Hero Headline (main H1 title)</label>
            <textarea
              rows={3}
              placeholder="How Working Professionals Are Using AI to Earn ₹50K–₹1L Extra Every Month"
              value={hero.hero_headline}
              onChange={(e) => updateHero("hero_headline", e.target.value)}
              style={{ ...INPUT_STYLE, resize: "vertical" }}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Hero Subheadline</label>
            <input
              type="text"
              placeholder="Without quitting their job or knowing how to code."
              value={hero.hero_subheadline}
              onChange={(e) => updateHero("hero_subheadline", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="two-col">
            <div>
              <label style={LABEL_STYLE}>CTA Button Text</label>
              <input
                type="text"
                placeholder="YES! Reserve My Spot"
                value={hero.hero_cta_text}
                onChange={(e) => updateHero("hero_cta_text", e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Rating Value (floating badge)</label>
              <input
                type="text"
                placeholder="4.9"
                value={hero.hero_rating_value}
                onChange={(e) => updateHero("hero_rating_value", e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Rating Label</label>
              <input
                type="text"
                placeholder="Avg Rating"
                value={hero.hero_rating_label}
                onChange={(e) => updateHero("hero_rating_label", e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Students Count (floating badge)</label>
              <input
                type="text"
                placeholder="12K+"
                value={hero.hero_students_count}
                onChange={(e) => updateHero("hero_students_count", e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={LABEL_STYLE}>Students Label</label>
              <input
                type="text"
                placeholder="Professionals Trained"
                value={hero.hero_students_label}
                onChange={(e) => updateHero("hero_students_label", e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Hero Image Manager ── */}
      <div style={CARD_STYLE}>
        <h2 style={SECTION_TITLE_STYLE}>
          <ImageIcon size={18} color="#f5a623" /> 2. Hero Image Manager
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.8125rem", margin: "0 0 1.5rem" }}>
          Paste a Google Drive share link (File → Share → Copy Link). Make sure the file is shared as <strong style={{ color: "#94a3b8" }}>&quot;Anyone with the link&quot;</strong>.
          If left blank, the default instructor photo is used.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", marginBottom: "1.25rem" }} className="image-input-row">
          <div style={{ flex: 1 }}>
            <label style={LABEL_STYLE}>Google Drive Image Link</label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/XXXX/view?usp=sharing"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <button
            type="button"
            onClick={handlePreviewImage}
            style={{
              background: "rgba(30,111,255,0.15)",
              border: "1px solid rgba(30,111,255,0.4)",
              color: "#60a5fa",
              padding: "0.75rem 1.25rem",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
            }}
          >
            <Plus size={15} /> Preview
          </button>
          {heroImageUrl && (
            <button
              type="button"
              onClick={handleDeleteImage}
              title="Remove image"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
                padding: "0.75rem",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Image preview */}
        {imagePreview ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              overflow: "hidden",
              position: "relative",
              background: "#111827",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Hero image preview"
              style={{ width: "100%", maxHeight: 360, objectFit: "cover", display: "block" }}
              onError={() => setImagePreview("")}
            />
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: "rgba(16,185,129,0.9)",
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 800,
                padding: "0.2rem 0.5rem",
                borderRadius: 6,
              }}
            >
              PREVIEW
            </div>
          </div>
        ) : (
          <div
            style={{
              border: "2px dashed rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "3rem",
              textAlign: "center",
              color: "#475569",
            }}
          >
            <ImageIcon size={32} style={{ marginBottom: "0.5rem", opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              {heroImageUrl
                ? "Image could not be loaded — check sharing permissions."
                : "No custom image set. The default instructor photo will be used."}
            </p>
          </div>
        )}
      </div>

      {/* ── SECTION 3: Stats Section ── */}
      <div style={CARD_STYLE}>
        <h2 style={SECTION_TITLE_STYLE}>
          <BarChart3 size={18} color="#10b981" /> 3. Stats Section (below hero)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="two-col">
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1rem" }}>
              <p style={{ color: "#1e6fff", fontWeight: 800, fontSize: "0.75rem", margin: "0 0 0.75rem", textTransform: "uppercase" }}>
                Stat {n}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <div>
                  <label style={LABEL_STYLE}>Value</label>
                  <input
                    type="text"
                    placeholder={`e.g. 12K+`}
                    value={(stats as any)[`stat${n}_value`]}
                    onChange={(e) => updateStats(`stat${n}_value`, e.target.value)}
                    style={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Label</label>
                  <input
                    type="text"
                    placeholder={`e.g. Professionals Trained`}
                    value={(stats as any)[`stat${n}_label`]}
                    onChange={(e) => updateStats(`stat${n}_label`, e.target.value)}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: Schedule & Zoom ── */}
      <div style={CARD_STYLE}>
        <h2 style={SECTION_TITLE_STYLE}>
          <Calendar size={18} color="#f5a623" /> 4. Cohort Schedule & Zoom Meeting
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="two-col">
          <div>
            <label style={LABEL_STYLE}>Cohort Title</label>
            <input
              type="text"
              value={cohort.title}
              onChange={(e) => updateCohort("title", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Session Duration (Hours)</label>
            <input
              type="number"
              min={1}
              max={24}
              value={cohort.duration_hours}
              onChange={(e) => updateCohort("duration_hours", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Cohort Date & Start Time *</label>
            <input
              type="datetime-local"
              required
              value={cohort.cohort_date}
              onChange={(e) => updateCohort("cohort_date", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Live Zoom / Meeting Link</label>
            <input
              type="url"
              required
              value={cohort.zoom_link}
              onChange={(e) => updateCohort("zoom_link", e.target.value)}
              placeholder="https://zoom.us/j/..."
              style={INPUT_STYLE}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={LABEL_STYLE}>Cohort Status</label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={cohort.is_active}
                onChange={(e) => updateCohort("is_active", e.target.checked)}
              />
              Active (visible on homepage)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={cohort.show_countdown}
                onChange={(e) => updateCohort("show_countdown", e.target.checked)}
              />
              Show countdown timer
            </label>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: Pricing & Seats ── */}
      <div style={CARD_STYLE}>
        <h2 style={SECTION_TITLE_STYLE}>
          <IndianRupee size={18} color="#10b981" /> 5. Pricing & Seats Allocation
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="two-col">
          <div>
            <label style={LABEL_STYLE}>Offer Price (₹ INR)</label>
            <input
              type="number"
              required
              min={0}
              value={cohort.price_inr}
              onChange={(e) => updateCohort("price_inr", e.target.value)}
              style={{ ...INPUT_STYLE, color: "#10b981", fontWeight: 700 }}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Original Strike Price (₹ INR)</label>
            <input
              type="number"
              min={0}
              value={cohort.original_price_inr}
              onChange={(e) => updateCohort("original_price_inr", e.target.value)}
              style={{ ...INPUT_STYLE, color: "#64748b" }}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Max Cohort Seats</label>
            <input
              type="number"
              min={1}
              value={cohort.max_seats}
              onChange={(e) => updateCohort("max_seats", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Seats Taken / Sold</label>
            <input
              type="number"
              min={0}
              value={cohort.seats_taken}
              onChange={(e) => updateCohort("seats_taken", e.target.value)}
              style={{ ...INPUT_STYLE, color: "#f5a623", fontWeight: 700 }}
            />
          </div>
        </div>
      </div>

      {/* ── Save Button ── */}
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
            opacity: saving ? 0.75 : 1,
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
          .two-col { grid-template-columns: 1fr !important; }
          .image-input-row { flex-direction: column !important; }
        }
      `}</style>
    </form>
  );
}
