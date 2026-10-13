"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Gift,
  Eye,
  UserCheck,
  MessageSquare,
  Sliders,
} from "lucide-react";
import InstructorTab, {
  InstructorStat,
  DEFAULT_INSTRUCTOR_CREDENTIALS,
  DEFAULT_INSTRUCTOR_STATS,
} from "./InstructorTab";
import FaqTab, { FAQItem, DEFAULT_FAQS } from "./FaqTab";
import SiteTickerTab from "./SiteTickerTab";

interface BonusItem {
  title: string;
  description: string;
  value: number;
}

interface WebsiteContentClientProps {
  initialSettings: Record<string, string>;
}

const DEFAULT_PAIN_POINTS = [
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

const DEFAULT_BONUSES: BonusItem[] = [
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

export default function WebsiteContentClient({ initialSettings }: WebsiteContentClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "pain_points" | "bonuses" | "instructor" | "faq" | "site_settings"
  >("pain_points");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "site-settings" || tabParam === "site_settings") {
      setActiveTab("site_settings");
    } else if (tabParam === "instructor") {
      setActiveTab("instructor");
    } else if (tabParam === "faq") {
      setActiveTab("faq");
    } else if (tabParam === "bonuses") {
      setActiveTab("bonuses");
    }
  }, [searchParams]);

  // --- Pain Points State ---
  const [painBadge, setPainBadge] = useState(
    initialSettings.pain_points_badge ?? "Does This Sound Like You?"
  );
  const [painTitle, setPainTitle] = useState(
    initialSettings.pain_points_title ?? "Click everything that applies to you"
  );
  const [painSubtitle, setPainSubtitle] = useState(
    initialSettings.pain_points_subtitle ?? "Tap the cards below to see how many you relate to."
  );

  let parsedPainItems: string[] = DEFAULT_PAIN_POINTS;
  try {
    if (initialSettings.pain_points_items) {
      const parsed = JSON.parse(initialSettings.pain_points_items);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedPainItems = parsed;
      }
    }
  } catch {
    parsedPainItems = DEFAULT_PAIN_POINTS;
  }
  const [painItems, setPainItems] = useState<string[]>(parsedPainItems);
  const [newPainItem, setNewPainItem] = useState("");
  const [editingPainIndex, setEditingPainIndex] = useState<number | null>(null);
  const [editingPainText, setEditingPainText] = useState("");

  // --- Bonuses State ---
  const [bonusBadge, setBonusBadge] = useState(
    initialSettings.bonuses_badge ?? "Free Bonuses"
  );
  const [bonusTitle, setBonusTitle] = useState(
    initialSettings.bonuses_title ?? "Unlock 5 Free Bonuses Worth ₹23,500+"
  );
  const [bonusSubtitle, setBonusSubtitle] = useState(
    initialSettings.bonuses_subtitle ?? "Reserve your seat and these are yours — instantly."
  );

  let parsedBonuses: BonusItem[] = DEFAULT_BONUSES;
  try {
    if (initialSettings.bonuses_items) {
      const parsed = JSON.parse(initialSettings.bonuses_items);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedBonuses = parsed;
      }
    }
  } catch {
    parsedBonuses = DEFAULT_BONUSES;
  }
  const [bonusItems, setBonusItems] = useState<BonusItem[]>(parsedBonuses);

  // Bonus Edit / Add State
  const [editingBonusIndex, setEditingBonusIndex] = useState<number | null>(null);
  const [bonusForm, setBonusForm] = useState<BonusItem>({
    title: "",
    description: "",
    value: 5000,
  });
  const [showBonusAddModal, setShowBonusAddModal] = useState(false);

  // --- Instructor State ---
  const [instructorBadge, setInstructorBadge] = useState(
    initialSettings.instructor_badge ?? "Your Instructor"
  );
  const [instructorName, setInstructorName] = useState(
    initialSettings.instructor_name ?? "Meet Neeraj Kumar"
  );
  const [instructorBio, setInstructorBio] = useState(
    initialSettings.instructor_bio ??
      "Neeraj Kumar is India's leading AI & LinkedIn growth strategist. He has trained over 12,000 working professionals across the country to leverage AI tools and LinkedIn to build income streams — without writing a single line of code."
  );
  const [instructorImageUrl, setInstructorImageUrl] = useState(
    initialSettings.instructor_image_url ?? "/neeraj-suit.jpg"
  );
  const [instructorCtaText, setInstructorCtaText] = useState(
    initialSettings.instructor_cta_text ?? "Learn from Neeraj"
  );
  const [instructorCtaLink, setInstructorCtaLink] = useState(
    initialSettings.instructor_cta_link ?? "/workshops"
  );

  let parsedCredentials: string[] = DEFAULT_INSTRUCTOR_CREDENTIALS;
  try {
    if (initialSettings.instructor_credentials) {
      const parsed = JSON.parse(initialSettings.instructor_credentials);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedCredentials = parsed;
      }
    }
  } catch {
    parsedCredentials = DEFAULT_INSTRUCTOR_CREDENTIALS;
  }
  const [instructorCredentials, setInstructorCredentials] = useState<string[]>(parsedCredentials);

  let parsedStats: InstructorStat[] = DEFAULT_INSTRUCTOR_STATS;
  try {
    if (initialSettings.instructor_stats) {
      const parsed = JSON.parse(initialSettings.instructor_stats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedStats = parsed;
      }
    }
  } catch {
    parsedStats = DEFAULT_INSTRUCTOR_STATS;
  }
  const [instructorStats, setInstructorStats] = useState<InstructorStat[]>(parsedStats);

  // --- FAQ State ---
  const [faqBadge, setFaqBadge] = useState(initialSettings.faq_badge ?? "FAQ");
  const [faqTitle, setFaqTitle] = useState(initialSettings.faq_title ?? "Questions, answered");

  let parsedFaqs: FAQItem[] = DEFAULT_FAQS;
  try {
    if (initialSettings.faq_items) {
      const parsed = JSON.parse(initialSettings.faq_items);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedFaqs = parsed;
      }
    }
  } catch {
    parsedFaqs = DEFAULT_FAQS;
  }
  const [faqItems, setFaqItems] = useState<FAQItem[]>(parsedFaqs);

  // Status & Notifications
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Derived Total Value for Bonuses
  const totalBonusValue = bonusItems.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

  // ---------------- Handlers: Pain Points ----------------
  const handleAddPainPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPainItem.trim()) return;
    setPainItems([...painItems, newPainItem.trim()]);
    setNewPainItem("");
  };

  const handleStartEditPain = (index: number) => {
    setEditingPainIndex(index);
    setEditingPainText(painItems[index]);
  };

  const handleSaveEditPain = (index: number) => {
    if (!editingPainText.trim()) return;
    const updated = [...painItems];
    updated[index] = editingPainText.trim();
    setPainItems(updated);
    setEditingPainIndex(null);
    setEditingPainText("");
  };

  const handleDeletePain = (index: number) => {
    setPainItems(painItems.filter((_, i) => i !== index));
    if (editingPainIndex === index) {
      setEditingPainIndex(null);
    }
  };

  const handleMovePain = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= painItems.length) return;
    const updated = [...painItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setPainItems(updated);
  };

  const handleResetPainDefaults = () => {
    if (confirm("Reset 'Does This Sound Like You?' items to default 10 statements?")) {
      setPainBadge("Does This Sound Like You?");
      setPainTitle("Click everything that applies to you");
      setPainSubtitle("Tap the cards below to see how many you relate to.");
      setPainItems(DEFAULT_PAIN_POINTS);
    }
  };

  // ---------------- Handlers: Bonuses ----------------
  const handleOpenAddBonus = () => {
    setBonusForm({ title: "", description: "", value: 5000 });
    setEditingBonusIndex(null);
    setShowBonusAddModal(true);
  };

  const handleOpenEditBonus = (index: number) => {
    setBonusForm({ ...bonusItems[index] });
    setEditingBonusIndex(index);
    setShowBonusAddModal(true);
  };

  const handleSaveBonusModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusForm.title.trim()) {
      alert("Please enter a title for the bonus.");
      return;
    }
    const val = Number(bonusForm.value) || 0;
    const newItem: BonusItem = {
      title: bonusForm.title.trim(),
      description: bonusForm.description.trim(),
      value: val,
    };

    if (editingBonusIndex !== null) {
      const updated = [...bonusItems];
      updated[editingBonusIndex] = newItem;
      setBonusItems(updated);
    } else {
      setBonusItems([...bonusItems, newItem]);
    }

    setShowBonusAddModal(false);
    setEditingBonusIndex(null);
  };

  const handleDeleteBonus = (index: number) => {
    setBonusItems(bonusItems.filter((_, i) => i !== index));
  };

  const handleMoveBonus = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bonusItems.length) return;
    const updated = [...bonusItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setBonusItems(updated);
  };

  const handleAutoFillBonusTitle = () => {
    setBonusTitle(
      `Unlock ${bonusItems.length} Free Bonuses Worth ₹${totalBonusValue.toLocaleString("en-IN")}+`
    );
  };

  const handleResetBonusDefaults = () => {
    if (confirm("Reset 'Free Bonuses' to default 5 bonuses?")) {
      setBonusBadge("Free Bonuses");
      setBonusTitle("Unlock 5 Free Bonuses Worth ₹23,500+");
      setBonusSubtitle("Reserve your seat and these are yours — instantly.");
      setBonusItems(DEFAULT_BONUSES);
    }
  };

  // ---------------- Save Handler ----------------
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess("");
    setErrorMessage("");

    try {
      const payload = {
        painPoints: {
          badge: painBadge,
          title: painTitle,
          subtitle: painSubtitle,
          items: painItems,
        },
        bonuses: {
          badge: bonusBadge,
          title: bonusTitle,
          subtitle: bonusSubtitle,
          items: bonusItems,
        },
        instructor: {
          badge: instructorBadge,
          name: instructorName,
          bio: instructorBio,
          imageUrl: instructorImageUrl,
          ctaText: instructorCtaText,
          ctaLink: instructorCtaLink,
          credentials: instructorCredentials,
          stats: instructorStats,
        },
        faq: {
          badge: faqBadge,
          title: faqTitle,
          items: faqItems,
        },
      };

      const res = await fetch("/api/admin/website-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save website content");
      }

      setSaveSuccess("Changes saved successfully! All marketing sections are updated live on the website.");
      router.refresh();
      setTimeout(() => setSaveSuccess(""), 5000);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: "5rem" }}>
      {/* Top Header Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
            <span
              style={{
                background: "rgba(30,111,255,0.15)",
                color: "#60a5fa",
                padding: "0.25rem 0.75rem",
                borderRadius: 9999,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              CMS Controls
            </span>
          </div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.5rem" }}>
            Changes in Website
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9375rem", margin: 0, maxWidth: 680 }}>
            Manage and edit the live marketing content for{" "}
            <strong style={{ color: "#f9fafb" }}>&quot;Does This Sound Like You?&quot;</strong>,{" "}
            <strong style={{ color: "#f9fafb" }}>&quot;Free Bonuses&quot;</strong>,{" "}
            <strong style={{ color: "#f9fafb" }}>&quot;Your Instructor&quot;</strong>, and{" "}
            <strong style={{ color: "#f9fafb" }}>&quot;FAQ&quot;</strong> sections.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: showPreview ? "rgba(30,111,255,0.2)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${showPreview ? "#1e6fff" : "rgba(255,255,255,0.12)"}`,
              color: showPreview ? "#60a5fa" : "#e2e8f0",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.625rem 1.125rem",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Eye size={16} />
            {showPreview ? "Hide Preview" : "Live Preview"}
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#1e6fff",
              border: "1px solid #1e6fff",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.625rem 1.375rem",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(30,111,255,0.35)",
              opacity: saving ? 0.7 : 1,
              transition: "all 0.15s ease",
            }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#10b981",
            padding: "0.875rem 1.25rem",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            fontWeight: 600,
            fontSize: "0.9375rem",
            marginBottom: "1.5rem",
          }}
        >
          <CheckCircle2 size={18} />
          {saveSuccess}
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#ef4444",
            padding: "0.875rem 1.25rem",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            fontWeight: 600,
            fontSize: "0.9375rem",
            marginBottom: "1.5rem",
          }}
        >
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: "0.625rem",
          background: "rgba(17, 24, 39, 0.6)",
          padding: "0.375rem",
          borderRadius: 14,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("pain_points")}
          style={{
            flex: "1 1 200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: 10,
            border: activeTab === "pain_points" ? "1px solid rgba(30,111,255,0.4)" : "1px solid transparent",
            background: activeTab === "pain_points" ? "rgba(30,111,255,0.18)" : "transparent",
            color: activeTab === "pain_points" ? "#60a5fa" : "#94a3b8",
            fontWeight: activeTab === "pain_points" ? 700 : 500,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <HelpCircle size={17} color={activeTab === "pain_points" ? "#60a5fa" : "#94a3b8"} />
          <span>Does This Sound Like You?</span>
          <span
            style={{
              background: activeTab === "pain_points" ? "#1e6fff" : "rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "0.15rem 0.5rem",
              borderRadius: 9999,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {painItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bonuses")}
          style={{
            flex: "1 1 180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: 10,
            border: activeTab === "bonuses" ? "1px solid rgba(245,166,35,0.4)" : "1px solid transparent",
            background: activeTab === "bonuses" ? "rgba(245,166,35,0.14)" : "transparent",
            color: activeTab === "bonuses" ? "#f5a623" : "#94a3b8",
            fontWeight: activeTab === "bonuses" ? 700 : 500,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Gift size={17} color={activeTab === "bonuses" ? "#f5a623" : "#94a3b8"} />
          <span>Free Bonuses</span>
          <span
            style={{
              background: activeTab === "bonuses" ? "#f5a623" : "rgba(255,255,255,0.1)",
              color: activeTab === "bonuses" ? "#000" : "#fff",
              padding: "0.15rem 0.5rem",
              borderRadius: 9999,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {bonusItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("instructor")}
          style={{
            flex: "1 1 180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: 10,
            border: activeTab === "instructor" ? "1px solid rgba(245,166,35,0.4)" : "1px solid transparent",
            background: activeTab === "instructor" ? "rgba(245,166,35,0.16)" : "transparent",
            color: activeTab === "instructor" ? "#f5a623" : "#94a3b8",
            fontWeight: activeTab === "instructor" ? 700 : 500,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <UserCheck size={17} color={activeTab === "instructor" ? "#f5a623" : "#94a3b8"} />
          <span>Your Instructor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faq")}
          style={{
            flex: "1 1 180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: 10,
            border: activeTab === "faq" ? "1px solid rgba(16,185,129,0.4)" : "1px solid transparent",
            background: activeTab === "faq" ? "rgba(16,185,129,0.16)" : "transparent",
            color: activeTab === "faq" ? "#10b981" : "#94a3b8",
            fontWeight: activeTab === "faq" ? 700 : 500,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <MessageSquare size={17} color={activeTab === "faq" ? "#10b981" : "#94a3b8"} />
          <span>FAQ</span>
          <span
            style={{
              background: activeTab === "faq" ? "#10b981" : "rgba(255,255,255,0.1)",
              color: activeTab === "faq" ? "#0a0f1e" : "#fff",
              padding: "0.15rem 0.5rem",
              borderRadius: 9999,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {faqItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("site_settings")}
          style={{
            flex: "1 1 190px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: 10,
            border: activeTab === "site_settings" ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
            background: activeTab === "site_settings" ? "rgba(59,130,246,0.18)" : "transparent",
            color: activeTab === "site_settings" ? "#60a5fa" : "#94a3b8",
            fontWeight: activeTab === "site_settings" ? 700 : 500,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Sliders size={17} color={activeTab === "site_settings" ? "#60a5fa" : "#94a3b8"} />
          <span>Site & Ticker Settings</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DOES THIS SOUND LIKE YOU? */}
      {/* ========================================================================= */}
      {activeTab === "pain_points" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Header Controls */}
          <div
            style={{
              background: "rgba(17, 24, 39, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 20,
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem" }}>
                  Section Header Settings
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
                  Controls the badge pill, main title, and subtitle text of the section.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetPainDefaults}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  fontSize: "0.8125rem",
                  padding: "0.4rem 0.75rem",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Badge Tag Text
                </label>
                <input
                  type="text"
                  value={painBadge}
                  onChange={(e) => setPainBadge(e.target.value)}
                  placeholder="Does This Sound Like You?"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={painTitle}
                  onChange={(e) => setPainTitle(e.target.value)}
                  placeholder="Click everything that applies to you"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                Subtitle / Instructions
              </label>
              <input
                type="text"
                value={painSubtitle}
                onChange={(e) => setPainSubtitle(e.target.value)}
                placeholder="Tap the cards below to see how many you relate to."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "0.9375rem",
                }}
              />
            </div>
          </div>

          {/* Add New Statement */}
          <div
            style={{
              background: "rgba(17, 24, 39, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 20,
              padding: "1.75rem",
            }}
          >
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem" }}>
              Add a New Pain Point Statement
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1rem" }}>
              Add relatable struggles that target your audience (e.g., &quot;I spend hours on tasks AI could do in minutes&quot;).
            </p>

            <form onSubmit={handleAddPainPoint} style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                value={newPainItem}
                onChange={(e) => setNewPainItem(e.target.value)}
                placeholder="Type a new statement here..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "0.9375rem",
                }}
              />
              <button
                type="submit"
                disabled={!newPainItem.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: newPainItem.trim() ? "#1e6fff" : "rgba(255,255,255,0.1)",
                  border: "none",
                  color: newPainItem.trim() ? "#fff" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0 1.25rem",
                  borderRadius: 10,
                  cursor: newPainItem.trim() ? "pointer" : "not-allowed",
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={16} /> Add Statement
              </button>
            </form>
          </div>

          {/* Existing Pain Points List */}
          <div
            style={{
              background: "rgba(17, 24, 39, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 20,
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem" }}>
                  Current Pain Points ({painItems.length})
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
                  Reorder, edit inline, or remove statements.
                </p>
              </div>
            </div>

            {painItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 14,
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}
              >
                No pain points added yet. Use the field above to add statements.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {painItems.map((item, index) => {
                  const isEditing = editingPainIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 12,
                        padding: "0.75rem 1rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "rgba(30,111,255,0.15)",
                          color: "#60a5fa",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        #{index + 1}
                      </span>

                      {/* Content or Edit Input */}
                      {isEditing ? (
                        <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
                          <input
                            type="text"
                            value={editingPainText}
                            onChange={(e) => setEditingPainText(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEditPain(index);
                              if (e.key === "Escape") setEditingPainIndex(null);
                            }}
                            style={{
                              flex: 1,
                              background: "rgba(0,0,0,0.4)",
                              border: "1px solid #1e6fff",
                              borderRadius: 8,
                              padding: "0.5rem 0.75rem",
                              color: "#fff",
                              fontSize: "0.9375rem",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditPain(index)}
                            style={{
                              background: "#10b981",
                              border: "none",
                              color: "#fff",
                              borderRadius: 8,
                              padding: "0 0.625rem",
                              cursor: "pointer",
                            }}
                            title="Save statement"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPainIndex(null)}
                            style={{
                              background: "rgba(255,255,255,0.1)",
                              border: "none",
                              color: "#cbd5e1",
                              borderRadius: 8,
                              padding: "0 0.625rem",
                              cursor: "pointer",
                            }}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ flex: 1, color: "#f1f5f9", fontSize: "0.9375rem" }}>
                          {item}
                        </div>
                      )}

                      {/* Action buttons */}
                      {!isEditing && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleMovePain(index, "up")}
                            disabled={index === 0}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: index === 0 ? "#475569" : "#cbd5e1",
                              borderRadius: 6,
                              padding: "0.375rem",
                              cursor: index === 0 ? "not-allowed" : "pointer",
                            }}
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePain(index, "down")}
                            disabled={index === painItems.length - 1}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: index === painItems.length - 1 ? "#475569" : "#cbd5e1",
                              borderRadius: 6,
                              padding: "0.375rem",
                              cursor: index === painItems.length - 1 ? "not-allowed" : "pointer",
                            }}
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEditPain(index)}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#60a5fa",
                              borderRadius: 6,
                              padding: "0.375rem",
                              cursor: "pointer",
                            }}
                            title="Edit statement"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePain(index)}
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.2)",
                              color: "#ef4444",
                              borderRadius: 6,
                              padding: "0.375rem",
                              cursor: "pointer",
                            }}
                            title="Delete statement"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FREE BONUSES */}
      {/* ========================================================================= */}
      {activeTab === "bonuses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Header Controls */}
          <div
            style={{
              background: "rgba(17, 24, 39, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 20,
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem" }}>
                  Bonus Section Header Settings
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
                  Customize the badge, headline, and subtitle for the Free Bonuses section.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleAutoFillBonusTitle}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    background: "rgba(245,166,35,0.12)",
                    border: "1px solid rgba(245,166,35,0.3)",
                    color: "#f5a623",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    padding: "0.4rem 0.75rem",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  title="Auto-update headline with total value calculated from items below"
                >
                  <Sparkles size={14} /> Sync Total to Headline
                </button>
                <button
                  type="button"
                  onClick={handleResetBonusDefaults}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                    fontSize: "0.8125rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={14} /> Reset Defaults
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Badge Tag Text
                </label>
                <input
                  type="text"
                  value={bonusBadge}
                  onChange={(e) => setBonusBadge(e.target.value)}
                  placeholder="Free Bonuses"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={bonusTitle}
                  onChange={(e) => setBonusTitle(e.target.value)}
                  placeholder="Unlock 5 Free Bonuses Worth ₹23,500+"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                Subtitle Text
              </label>
              <input
                type="text"
                value={bonusSubtitle}
                onChange={(e) => setBonusSubtitle(e.target.value)}
                placeholder="Reserve your seat and these are yours — instantly."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "0.9375rem",
                }}
              />
            </div>
          </div>

          {/* Bonus Items Summary Banner */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "1.25rem",
              background: "linear-gradient(135deg, rgba(245,166,35,0.08), rgba(30,111,255,0.06))",
              border: "1px solid rgba(245,166,35,0.25)",
              borderRadius: 18,
              padding: "1.5rem",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ color: "#94a3b8", fontSize: "0.8125rem", margin: "0 0 0.25rem" }}>Total Bonuses</p>
              <h3 style={{ color: "#f9fafb", fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                {bonusItems.length} Items Included
              </h3>
            </div>
            <div>
              <p style={{ color: "#94a3b8", fontSize: "0.8125rem", margin: "0 0 0.25rem" }}>Combined Claim Value</p>
              <h3 style={{ color: "#f5a623", fontSize: "1.5rem", fontWeight: 900, margin: 0 }}>
                ₹{totalBonusValue.toLocaleString("en-IN")}+
              </h3>
            </div>
            <div>
              <button
                type="button"
                onClick={handleOpenAddBonus}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#f5a623",
                  border: "none",
                  color: "#0a0f1e",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: 10,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(245,166,35,0.3)",
                }}
              >
                <Plus size={16} /> Add New Bonus
              </button>
            </div>
          </div>

          {/* Bonus Items List */}
          <div
            style={{
              background: "rgba(17, 24, 39, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 20,
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem" }}>
                  Bonus Cards List
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
                  Each bonus features the blue gift box icon with a dark background.
                </p>
              </div>
            </div>

            {bonusItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 14,
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}
              >
                No bonuses added yet. Click &quot;Add New Bonus&quot; to create one.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {bonusItems.map((bonus, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 14,
                      padding: "1rem 1.25rem",
                    }}
                  >
                    {/* Index badge */}
                    <span
                      style={{
                        width: 24,
                        color: "#64748b",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      #{index + 1}
                    </span>

                    {/* Blue Giftbox Icon with Dark Background */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        background: "rgba(10, 15, 30, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      <img
                        src="/bluegiftbox.png"
                        alt="Gift Icon"
                        style={{ width: 30, height: 30, objectFit: "contain" }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <h4 style={{ color: "#f9fafb", fontWeight: 700, fontSize: "0.9375rem", margin: 0 }}>
                          {bonus.title}
                        </h4>
                      </div>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.8125rem",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bonus.description}
                      </p>
                    </div>

                    {/* Value */}
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: "0.75rem",
                          textDecoration: "line-through",
                          display: "block",
                          marginBottom: "0.15rem",
                        }}
                      >
                        ₹{Number(bonus.value).toLocaleString("en-IN")}
                      </span>
                      <span
                        style={{
                          background: "rgba(16,185,129,0.15)",
                          border: "1px solid rgba(16,185,129,0.3)",
                          color: "#10b981",
                          fontWeight: 700,
                          fontSize: "0.6875rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: 9999,
                        }}
                      >
                        FREE
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleMoveBonus(index, "up")}
                        disabled={index === 0}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: index === 0 ? "#475569" : "#cbd5e1",
                          borderRadius: 6,
                          padding: "0.375rem",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                        }}
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBonus(index, "down")}
                        disabled={index === bonusItems.length - 1}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: index === bonusItems.length - 1 ? "#475569" : "#cbd5e1",
                          borderRadius: 6,
                          padding: "0.375rem",
                          cursor: index === bonusItems.length - 1 ? "not-allowed" : "pointer",
                        }}
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditBonus(index)}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#f5a623",
                          borderRadius: 6,
                          padding: "0.375rem",
                          cursor: "pointer",
                        }}
                        title="Edit Bonus"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBonus(index)}
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          color: "#ef4444",
                          borderRadius: 6,
                          padding: "0.375rem",
                          cursor: "pointer",
                        }}
                        title="Delete Bonus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT BONUS */}
      {/* ========================================================================= */}
      {showBonusAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={() => setShowBonusAddModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 550,
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(245,166,35,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Gift size={20} color="#f5a623" />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f9fafb", margin: 0 }}>
                  {editingBonusIndex !== null ? "Edit Bonus" : "Add New Bonus"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBonusAddModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBonusModal} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Bonus Title *
                </label>
                <input
                  type="text"
                  required
                  value={bonusForm.title}
                  onChange={(e) => setBonusForm({ ...bonusForm, title: e.target.value })}
                  placeholder="e.g. AI Niche Goldmine Guide"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={bonusForm.description}
                  onChange={(e) => setBonusForm({ ...bonusForm, description: e.target.value })}
                  placeholder="e.g. 100+ AI-powered business niches you can start today with zero investment."
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Perceived Value (in ₹ INR) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={bonusForm.value}
                  onChange={(e) => setBonusForm({ ...bonusForm, value: Number(e.target.value) })}
                  placeholder="5000"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              {/* Icon reminder */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(10, 15, 30, 0.95)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src="/bluegiftbox.png" alt="Icon" style={{ width: 24, height: 24, objectFit: "contain" }} />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                  Icon automatically assigned: <strong>Blue Gift Box</strong> on dark background.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowBonusAddModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#e2e8f0",
                    fontWeight: 600,
                    padding: "0.75rem 1.25rem",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#f5a623",
                    border: "none",
                    color: "#0a0f1e",
                    fontWeight: 800,
                    padding: "0.75rem 1.5rem",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  {editingBonusIndex !== null ? "Update Bonus" : "Add Bonus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE PREVIEW SECTION */}
      {/* ========================================================================= */}
      {showPreview && (
        <div
          style={{
            marginTop: "3rem",
            background: "rgba(10, 15, 30, 0.95)",
            border: "1px solid rgba(30,111,255,0.3)",
            borderRadius: 24,
            padding: "2.5rem 1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(16,185,129,0.15)",
                color: "#10b981",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.25rem 0.75rem",
                borderRadius: 9999,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Interactive Live Preview
            </span>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
              Viewing how the active tab ({activeTab === "pain_points" ? "Does This Sound Like You?" : "Free Bonuses"}) looks to visitors:
            </p>
          </div>

          {activeTab === "pain_points" ? (
            <div style={{ maxWidth: 850, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
                  {painBadge || "Does This Sound Like You?"}
                </span>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#f9fafb",
                    margin: "0 0 0.75rem",
                  }}
                >
                  {painTitle || "Click everything that applies to you"}
                </h2>
                <p style={{ color: "#94a3b8", margin: 0 }}>
                  {painSubtitle || "Tap the cards below to see how many you relate to."}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  justifyContent: "center",
                }}
              >
                {painItems.map((point, i) => (
                  <div
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.25rem",
                      borderRadius: 9999,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(17,24,39,0.6)",
                      color: "#94a3b8",
                      fontSize: "0.9375rem",
                    }}
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 850, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
                  {bonusBadge || "Free Bonuses"}
                </span>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#f9fafb",
                    margin: "0 0 0.75rem",
                  }}
                >
                  {bonusTitle || `Unlock ${bonusItems.length} Free Bonuses Worth ₹${totalBonusValue.toLocaleString("en-IN")}+`}
                </h2>
                <p style={{ color: "#94a3b8", margin: 0 }}>
                  {bonusSubtitle || "Reserve your seat and these are yours — instantly."}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {bonusItems.map((bonus, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      background: "rgba(17,24,39,0.8)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14,
                      padding: "1.25rem 1.5rem",
                    }}
                  >
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
                      }}
                    >
                      <img
                        src="/bluegiftbox.png"
                        alt="Bonus Icon"
                        style={{ width: 34, height: 34, objectFit: "contain" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#f9fafb", fontWeight: 700, margin: "0 0 0.25rem", fontSize: "1rem" }}>
                        {bonus.title}
                      </p>
                      <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
                        {bonus.description}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <p style={{ color: "#64748b", fontSize: "0.75rem", textDecoration: "line-through", margin: "0 0 2px" }}>
                        ₹{Number(bonus.value).toLocaleString("en-IN")}
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
                        }}
                      >
                        FREE
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: YOUR INSTRUCTOR */}
      {/* ========================================================================= */}
      {activeTab === "instructor" && (
        <InstructorTab
          badge={instructorBadge}
          setBadge={setInstructorBadge}
          name={instructorName}
          setName={setInstructorName}
          bio={instructorBio}
          setBio={setInstructorBio}
          imageUrl={instructorImageUrl}
          setImageUrl={setInstructorImageUrl}
          ctaText={instructorCtaText}
          setCtaText={setInstructorCtaText}
          ctaLink={instructorCtaLink}
          setCtaLink={setInstructorCtaLink}
          credentials={instructorCredentials}
          setCredentials={setInstructorCredentials}
          stats={instructorStats}
          setStats={setInstructorStats}
          showPreview={showPreview}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FAQ */}
      {/* ========================================================================= */}
      {activeTab === "faq" && (
        <FaqTab
          badge={faqBadge}
          setBadge={setFaqBadge}
          title={faqTitle}
          setTitle={setFaqTitle}
          items={faqItems}
          setItems={setFaqItems}
          showPreview={showPreview}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SITE & TICKER SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "site_settings" && (
        <SiteTickerTab initialSettings={initialSettings} />
      )}

      {/* Bottom Sticky Save Bar (only for CMS tabs that share Save All Changes) */}
      {activeTab !== "site_settings" && (
        <div
          style={{
            position: "sticky",
            bottom: "1.5rem",
            marginTop: "3rem",
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Sparkles size={18} color="#60a5fa" />
            <span style={{ color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 500 }}>
              Ready to apply changes to marketing pages?
            </span>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#1e6fff",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.625rem 1.5rem",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(30,111,255,0.4)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
