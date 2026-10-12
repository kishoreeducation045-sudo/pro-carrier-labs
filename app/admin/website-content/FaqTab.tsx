"use client";

import { useState } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    q: "Who is this course for?",
    a: "This is for working professionals — salaried employees, freelancers, consultants, and business owners — who want to use AI to earn more or save time. No technical background needed.",
  },
  {
    q: "Do I need to know coding or AI tools beforehand?",
    a: "Absolutely not. Neeraj teaches from scratch, assuming zero prior knowledge. If you can use WhatsApp, you can learn what's taught here.",
  },
  {
    q: "Will I get a recording after the live session?",
    a: "Yes! Lifetime access to recordings and all course materials is included with every enrollment.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. We offer a 7-day refund policy, no questions asked. If you're not satisfied within 7 days of enrollment, just contact support and we'll process your refund.",
  },
  {
    q: "How do I join the live session?",
    a: "After enrollment, you'll receive a Zoom link via email and on your dashboard. Simply click to join on the scheduled date and time.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes! Upon completing the course (100% progress), you'll automatically receive a ProCareerLabs certificate of completion, shareable on LinkedIn.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI, credit/debit cards, net banking, and EMI options — all processed securely through Razorpay.",
  },
  {
    q: "Can I access the course on mobile?",
    a: "Yes, the student portal is fully mobile-responsive. You can learn on your phone, tablet, or desktop.",
  },
];

interface FaqTabProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  items: FAQItem[];
  setItems: (val: FAQItem[]) => void;
  showPreview: boolean;
}

export default function FaqTab({
  badge,
  setBadge,
  title,
  setTitle,
  items,
  setItems,
  showPreview,
}: FaqTabProps) {
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formQ, setFormQ] = useState("");
  const [formA, setFormA] = useState("");

  // Live Accordion Test State
  const [previewOpen, setPreviewOpen] = useState<number | null>(0);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormQ("");
    setFormA("");
    setShowModal(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormQ(items[index].q);
    setFormA(items[index].a);
    setShowModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQ.trim() || !formA.trim()) {
      alert("Please provide both a Question and an Answer.");
      return;
    }

    const newItem: FAQItem = {
      q: formQ.trim(),
      a: formA.trim(),
    };

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = newItem;
      setItems(updated);
    } else {
      setItems([...items, newItem]);
    }

    setShowModal(false);
    setEditingIndex(null);
    setFormQ("");
    setFormA("");
  };

  const handleDelete = (index: number) => {
    if (confirm(`Delete FAQ: "${items[index].q}"?`)) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setItems(updated);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset FAQ section to default 8 questions and answers?")) {
      setBadge("FAQ");
      setTitle("Questions, answered");
      setItems(DEFAULT_FAQS);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 1. FAQ Header Settings */}
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
              <HelpCircle size={18} color="#60a5fa" />
              FAQ Header Settings
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
              Customize the section badge pill and main heading title.
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Badge Pill Text
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. FAQ"
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
              Section Heading Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Questions, answered"
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

      {/* 2. FAQ Items Management */}
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
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.25rem" }}>
              Frequently Asked Questions ({items.length})
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
              Add, edit, delete, or reorder the expandable FAQ questions and answers.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#1e6fff",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.625rem 1.25rem",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(30,111,255,0.3)",
            }}
          >
            <Plus size={16} /> Add New FAQ
          </button>
        </div>

        {/* List of FAQ Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {items.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(10, 15, 30, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "1.125rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1.25rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
                  <span
                    style={{
                      background: "rgba(30,111,255,0.15)",
                      color: "#60a5fa",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      padding: "0.15rem 0.5rem",
                      borderRadius: 6,
                    }}
                  >
                    Q{idx + 1}
                  </span>
                  <h4 style={{ margin: 0, color: "#f9fafb", fontSize: "1rem", fontWeight: 700 }}>
                    {faq.q}
                  </h4>
                </div>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6, paddingLeft: "2rem" }}>
                  {faq.a}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: idx === 0 ? "#475569" : "#94a3b8",
                    cursor: idx === 0 ? "not-allowed" : "pointer",
                    padding: "0.25rem",
                  }}
                  title="Move Up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === items.length - 1}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: idx === items.length - 1 ? "#475569" : "#94a3b8",
                    cursor: idx === items.length - 1 ? "not-allowed" : "pointer",
                    padding: "0.25rem",
                  }}
                  title="Move Down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  style={{
                    background: "rgba(30,111,255,0.12)",
                    border: "none",
                    color: "#60a5fa",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "none",
                    color: "#ef4444",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Accordion Live Preview */}
      {showPreview && (
        <div
          style={{
            background: "linear-gradient(180deg, #0a0f1e 0%, #0d1526 100%)",
            border: "1px solid rgba(30, 111, 255, 0.35)",
            borderRadius: 24,
            padding: "2.5rem 2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Sparkles size={16} color="#60a5fa" />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Live Accordion Preview (Click to test interaction)
            </span>
          </div>

          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(30,111,255,0.1)",
                border: "1px solid rgba(30,111,255,0.25)",
                color: "#60a5fa",
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
              {title}
            </h2>
          </div>

          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              background: "rgba(17,24,39,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {items.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPreviewOpen(previewOpen === i ? null : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "1.125rem 1.5rem",
                    background: "none",
                    border: "none",
                    color: previewOpen === i ? "#f9fafb" : "#d1d5db",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  {faq.q}
                  <div
                    style={{
                      flexShrink: 0,
                      color: previewOpen === i ? "#1e6fff" : "#64748b",
                      transition: "transform 0.3s ease",
                      transform: previewOpen === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {previewOpen === i && (
                  <div style={{ padding: "0 1.5rem 1.125rem" }}>
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit FAQ Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "rgba(17, 24, 39, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: "2rem",
              maxWidth: 580,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f9fafb", margin: 0 }}>
                {editingIndex !== null ? `Edit FAQ #${editingIndex + 1}` : "Add New Question & Answer"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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

            <form onSubmit={handleSaveModal} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formQ}
                  onChange={(e) => setFormQ(e.target.value)}
                  placeholder="e.g. Will I get recordings after the live session?"
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
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formA}
                  onChange={(e) => setFormA(e.target.value)}
                  placeholder="e.g. Yes! Lifetime access to all recordings and study resources is included with your registration."
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#cbd5e1",
                    padding: "0.625rem 1.25rem",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#1e6fff",
                    border: "none",
                    color: "#fff",
                    padding: "0.625rem 1.5rem",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(30,111,255,0.4)",
                  }}
                >
                  {editingIndex !== null ? "Save Changes" : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
