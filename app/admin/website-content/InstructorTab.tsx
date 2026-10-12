"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UserCheck,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export interface InstructorStat {
  value: string;
  label: string;
}

export const DEFAULT_INSTRUCTOR_CREDENTIALS = [
  "LinkedIn Top Voice with 150K+ followers",
  "Built 9+ AI-powered workflows used daily by enterprise teams",
  "Featured speaker at 150+ corporate AI workshops",
  "Helped 500+ professionals land jobs & promotions using AI + LinkedIn",
  "10+ years of training experience in tech & people skills",
];

export const DEFAULT_INSTRUCTOR_STATS: InstructorStat[] = [
  { value: "12K+", label: "Trained" },
  { value: "150+", label: "Workshops" },
  { value: "4.9★", label: "Avg Rating" },
];

interface InstructorTabProps {
  badge: string;
  setBadge: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  ctaText: string;
  setCtaText: (val: string) => void;
  ctaLink: string;
  setCtaLink: (val: string) => void;
  credentials: string[];
  setCredentials: (val: string[]) => void;
  stats: InstructorStat[];
  setStats: (val: InstructorStat[]) => void;
  showPreview: boolean;
}

export default function InstructorTab({
  badge,
  setBadge,
  name,
  setName,
  bio,
  setBio,
  imageUrl,
  setImageUrl,
  ctaText,
  setCtaText,
  ctaLink,
  setCtaLink,
  credentials,
  setCredentials,
  stats,
  setStats,
  showPreview,
}: InstructorTabProps) {
  // Credentials Add & Edit
  const [newCredential, setNewCredential] = useState("");
  const [editingCredIndex, setEditingCredIndex] = useState<number | null>(null);
  const [editingCredText, setEditingCredText] = useState("");

  // Stats Add & Edit
  const [newStatValue, setNewStatValue] = useState("");
  const [newStatLabel, setNewStatLabel] = useState("");
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const [editStatValue, setEditStatValue] = useState("");
  const [editStatLabel, setEditStatLabel] = useState("");

  // Handlers for Credentials
  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredential.trim()) return;
    setCredentials([...credentials, newCredential.trim()]);
    setNewCredential("");
  };

  const handleStartEditCred = (index: number) => {
    setEditingCredIndex(index);
    setEditingCredText(credentials[index]);
  };

  const handleSaveEditCred = (index: number) => {
    if (!editingCredText.trim()) return;
    const updated = [...credentials];
    updated[index] = editingCredText.trim();
    setCredentials(updated);
    setEditingCredIndex(null);
    setEditingCredText("");
  };

  const handleDeleteCred = (index: number) => {
    setCredentials(credentials.filter((_, i) => i !== index));
    if (editingCredIndex === index) setEditingCredIndex(null);
  };

  const handleMoveCred = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= credentials.length) return;
    const updated = [...credentials];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setCredentials(updated);
  };

  // Handlers for Stats
  const handleAddStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatValue.trim() || !newStatLabel.trim()) return;
    setStats([...stats, { value: newStatValue.trim(), label: newStatLabel.trim() }]);
    setNewStatValue("");
    setNewStatLabel("");
  };

  const handleStartEditStat = (index: number) => {
    setEditingStatIndex(index);
    setEditStatValue(stats[index].value);
    setEditStatLabel(stats[index].label);
  };

  const handleSaveEditStat = (index: number) => {
    if (!editStatValue.trim() || !editStatLabel.trim()) return;
    const updated = [...stats];
    updated[index] = { value: editStatValue.trim(), label: editStatLabel.trim() };
    setStats(updated);
    setEditingStatIndex(null);
  };

  const handleDeleteStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
    if (editingStatIndex === index) setEditingStatIndex(null);
  };

  const handleMoveStat = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= stats.length) return;
    const updated = [...stats];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setStats(updated);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset 'Your Instructor' to default profile values?")) {
      setBadge("Your Instructor");
      setName("Meet Neeraj Kumar");
      setBio(
        "Neeraj Kumar is India's leading AI & LinkedIn growth strategist. He has trained over 12,000 working professionals across the country to leverage AI tools and LinkedIn to build income streams — without writing a single line of code."
      );
      setImageUrl("/neeraj-suit.jpg");
      setCtaText("Learn from Neeraj");
      setCtaLink("/workshops");
      setCredentials(DEFAULT_INSTRUCTOR_CREDENTIALS);
      setStats(DEFAULT_INSTRUCTOR_STATS);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 1. Header & Profile Settings */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "1.75rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UserCheck size={18} color="#f5a623" />
              Instructor Profile & Section Settings
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
              Edit the instructor name, bio paragraph, photo, and call-to-action button.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#cbd5e1",
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
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Badge Pill Text
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. YOUR INSTRUCTOR"
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
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Main Heading / Instructor Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meet Neeraj Kumar"
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

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <div>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Photo Image URL or Path
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. /neeraj-suit.jpg or https://..."
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

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "0.5rem 1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#1f2937", flexShrink: 0 }}>
              <Image
                src={imageUrl || "/neeraj-suit.jpg"}
                alt="Thumbnail"
                width={44}
                height={44}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Active photo preview
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
            Biography Text
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write instructor biography, background, and achievement highlights..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: "#fff",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              CTA Button Label
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Learn from Neeraj"
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
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              CTA Button Destination Link
            </label>
            <input
              type="text"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. /workshops"
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
      </div>

      {/* 2. Key Stats Manager */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "1.75rem",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TrendingUp size={18} color="#60a5fa" />
            Instructor Stat Boxes ({stats.length})
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Highlighted statistics appearing below the instructor photo (e.g. 12K+ Trained, 150+ Workshops, 4.9★ Avg Rating).
          </p>
        </div>

        {/* Existing Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {stats.map((st, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(10, 15, 30, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "1rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              {editingStatIndex === idx ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={editStatValue}
                    onChange={(e) => setEditStatValue(e.target.value)}
                    placeholder="Value (e.g. 15K+)"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(30,111,255,0.5)",
                      borderRadius: 8,
                      padding: "0.5rem 0.75rem",
                      color: "#60a5fa",
                      fontWeight: 800,
                      fontSize: "1rem",
                    }}
                  />
                  <input
                    type="text"
                    value={editStatLabel}
                    onChange={(e) => setEditStatLabel(e.target.value)}
                    placeholder="Label (e.g. Students Trained)"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      padding: "0.5rem 0.75rem",
                      color: "#fff",
                      fontSize: "0.875rem",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <button
                      type="button"
                      onClick={() => handleSaveEditStat(idx)}
                      style={{
                        flex: 1,
                        background: "#10b981",
                        border: "none",
                        color: "#fff",
                        fontWeight: 700,
                        padding: "0.375rem",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStatIndex(null)}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "#cbd5e1",
                        padding: "0.375rem 0.75rem",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span style={{ color: "#1e6fff", fontWeight: 800, fontSize: "1.375rem", display: "block" }}>
                      {st.value}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 500 }}>
                      {st.label}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.625rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        type="button"
                        onClick={() => handleMoveStat(idx, "up")}
                        disabled={idx === 0}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: idx === 0 ? "#475569" : "#94a3b8",
                          cursor: idx === 0 ? "not-allowed" : "pointer",
                          padding: "0.25rem",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStat(idx, "down")}
                        disabled={idx === stats.length - 1}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: idx === stats.length - 1 ? "#475569" : "#94a3b8",
                          cursor: idx === stats.length - 1 ? "not-allowed" : "pointer",
                          padding: "0.25rem",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => handleStartEditStat(idx)}
                        style={{
                          background: "rgba(30,111,255,0.1)",
                          border: "none",
                          color: "#60a5fa",
                          borderRadius: 6,
                          padding: "0.35rem 0.625rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStat(idx)}
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "none",
                          color: "#ef4444",
                          borderRadius: 6,
                          padding: "0.35rem 0.625rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Stat Inline Form */}
        <form onSubmit={handleAddStat} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={newStatValue}
            onChange={(e) => setNewStatValue(e.target.value)}
            placeholder="Stat Value (e.g. 500+)"
            style={{
              flex: "1 1 140px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "0.625rem 0.875rem",
              color: "#fff",
              fontSize: "0.875rem",
            }}
          />
          <input
            type="text"
            value={newStatLabel}
            onChange={(e) => setNewStatLabel(e.target.value)}
            placeholder="Stat Label (e.g. 5-Star Reviews)"
            style={{
              flex: "2 1 200px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "0.625rem 0.875rem",
              color: "#fff",
              fontSize: "0.875rem",
            }}
          />
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "#1e6fff",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.625rem 1.125rem",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Add Stat Box
          </button>
        </form>
      </div>

      {/* 3. Credentials & Highlights Checklist */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "1.75rem",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle2 size={18} color="#10b981" />
            Credentials & Achievements ({credentials.length})
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Bullet points displayed next to the bio with verified checkmark icons.
          </p>
        </div>

        {/* Add Credential Bar */}
        <form onSubmit={handleAddCredential} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={newCredential}
            onChange={(e) => setNewCredential(e.target.value)}
            placeholder="e.g. Featured Keynote Speaker at Google Cloud Summit"
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "#10b981",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.75rem 1.25rem",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Add Bullet
          </button>
        </form>

        {/* Credentials List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {credentials.map((cred, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(10, 15, 30, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 12,
                padding: "0.875rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                {editingCredIndex === idx ? (
                  <input
                    type="text"
                    value={editingCredText}
                    onChange={(e) => setEditingCredText(e.target.value)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(30,111,255,0.5)",
                      borderRadius: 6,
                      padding: "0.375rem 0.625rem",
                      color: "#fff",
                      fontSize: "0.9375rem",
                    }}
                  />
                ) : (
                  <span style={{ color: "#e2e8f0", fontSize: "0.9375rem" }}>{cred}</span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                {editingCredIndex === idx ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEditCred(idx)}
                      style={{
                        background: "#10b981",
                        border: "none",
                        color: "#fff",
                        padding: "0.375rem 0.625rem",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCredIndex(null)}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "#cbd5e1",
                        padding: "0.375rem",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleMoveCred(idx, "up")}
                      disabled={idx === 0}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: idx === 0 ? "#475569" : "#94a3b8",
                        cursor: idx === 0 ? "not-allowed" : "pointer",
                        padding: "0.25rem",
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveCred(idx, "down")}
                      disabled={idx === credentials.length - 1}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: idx === credentials.length - 1 ? "#475569" : "#94a3b8",
                        cursor: idx === credentials.length - 1 ? "not-allowed" : "pointer",
                        padding: "0.25rem",
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEditCred(idx)}
                      style={{
                        background: "rgba(30,111,255,0.1)",
                        border: "none",
                        color: "#60a5fa",
                        borderRadius: 6,
                        padding: "0.375rem 0.625rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCred(idx)}
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "none",
                        color: "#ef4444",
                        borderRadius: 6,
                        padding: "0.375rem 0.625rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Visual Preview */}
      {showPreview && (
        <div
          style={{
            background: "linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)",
            border: "1px solid rgba(245, 166, 35, 0.35)",
            borderRadius: 24,
            padding: "2.5rem 2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Sparkles size={16} color="#f5a623" />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Live Homepage Preview
            </span>
          </div>

          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(245,166,35,0.1)",
                border: "1px solid rgba(245,166,35,0.25)",
                color: "#f5a623",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.3rem 0.875rem",
                borderRadius: 9999,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              {badge}
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#f9fafb", margin: 0 }}>
              {name}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2.5rem", alignItems: "center" }}>
            {/* Photo & Stats preview */}
            <div>
              <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                <Image
                  src={imageUrl || "/neeraj-suit.jpg"}
                  alt={name}
                  width={400}
                  height={480}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`, gap: "0.5rem", marginTop: "1rem" }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                    <p style={{ color: "#1e6fff", fontWeight: 800, fontSize: "1.125rem", margin: 0 }}>{s.value}</p>
                    <p style={{ color: "#64748b", fontSize: "0.6875rem", margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio & Credentials preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ color: "#94a3b8", fontSize: "0.9375rem", margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {bio}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {credentials.map((cred, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.5 }}>{cred}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#1e6fff",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  padding: "0.875rem 1.75rem",
                  borderRadius: 9999,
                  alignSelf: "flex-start",
                  boxShadow: "0 0 20px rgba(30,111,255,0.3)",
                }}
              >
                {ctaText} <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
