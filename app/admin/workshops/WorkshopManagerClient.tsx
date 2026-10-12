"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Clock, Eye, Save, X, Loader2, Trash2, AlertTriangle } from "lucide-react";

interface Workshop {
  id: string;
  title: string;
  slug: string;
  headline?: string;
  description: string;
  category: string;
  price_inr: number;
  original_price_inr?: number;
  course_duration_hours: number;
  difficulty_level: string;
  drive_url?: string;
  zoom_link?: string;
  status: string;
  features?: string[];
  featuresStr?: string;
}

interface WorkshopManagerClientProps {
  initialWorkshops: Workshop[];
}

export default function WorkshopManagerClient({ initialWorkshops }: WorkshopManagerClientProps) {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [deletingWorkshop, setDeletingWorkshop] = useState<Workshop | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleConfirmDelete = async () => {
    if (!deletingWorkshop) return;
    setDeleting(true);
    setMsg("");

    try {
      const res = await fetch(`/api/admin/courses?id=${deletingWorkshop.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete workshop");

      setWorkshops((prev) => prev.filter((w) => w.id !== deletingWorkshop.id));
      setMsg(`Workshop "${deletingWorkshop.title}" was successfully deleted.`);
      setDeletingWorkshop(null);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete workshop");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (workshop: Workshop) => {
    setIsNew(false);
    setEditingWorkshop({
      ...workshop,
      featuresStr: Array.isArray(workshop.features) ? workshop.features.join("\n") : "",
    });
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingWorkshop({
      id: "",
      title: "",
      slug: "",
      headline: "",
      description: "",
      category: "Artificial Intelligence",
      price_inr: 299,
      original_price_inr: 2999,
      course_duration_hours: 3,
      difficulty_level: "Beginner",
      drive_url: "",
      zoom_link: "",
      status: "published",
      featuresStr: "Live Interactive Workshop\nPrompt Vault Access\nAutonomous Agent Blueprint\nVerifiable Certificate",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop) return;
    setSaving(true);
    setMsg("");

    const features = editingWorkshop.featuresStr
      ? editingWorkshop.featuresStr.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingWorkshop,
          features,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save workshop");

      setMsg("Workshop saved successfully!");
      setEditingWorkshop(null);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save workshop");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#f9fafb" }}>
          All Active Workshops & Masterclasses ({workshops.length})
        </h2>
        <button
          onClick={handleNew}
          style={{
            background: "#1e6fff",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 14px rgba(30,111,255,0.35)",
          }}
        >
          <Plus size={16} /> Add New Workshop
        </button>
      </div>

      {msg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "0.875rem 1rem", borderRadius: 10, marginBottom: "1.5rem", fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Workshop Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {workshops.map((workshop) => (
          <div
            key={workshop.id}
            style={{
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 18,
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#f5a623", fontWeight: 800, background: "rgba(245, 166, 35, 0.15)", padding: "0.2rem 0.5rem", borderRadius: 6 }}>
                  {workshop.category}
                </span>
                <span style={{ fontSize: "0.75rem", color: workshop.status === "published" ? "#10b981" : "#64748b", fontWeight: 700 }}>
                  ● {workshop.status}
                </span>
              </div>

              <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                {workshop.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1rem", lineHeight: 1.5 }}>
                {workshop.headline || workshop.description}
              </p>

              <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "#64748b", marginBottom: "1rem" }}>
                <span><Clock size={13} style={{ display: "inline", marginRight: 4 }} />{workshop.course_duration_hours}h</span>
                <span>Slug: <strong style={{ color: "#cbd5e1" }}>{workshop.slug}</strong></span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#10b981" }}>
                ₹{workshop.price_inr}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a
                  href={`/workshops/${workshop.slug}`}
                  target="_blank"
                  title="View Public Workshop Page"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#94a3b8",
                    padding: "0.5rem",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Eye size={15} />
                </a>

                <button
                  onClick={() => handleEdit(workshop)}
                  style={{
                    background: "rgba(30, 111, 255, 0.15)",
                    border: "1px solid rgba(30, 111, 255, 0.3)",
                    color: "#60a5fa",
                    padding: "0.5rem 0.875rem",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <Edit2 size={14} /> Edit Workshop
                </button>

                <button
                  onClick={() => setDeletingWorkshop(workshop)}
                  title="Delete Workshop"
                  style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    padding: "0.5rem 0.75rem",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    transition: "all 0.2s",
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingWorkshop && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 15, 30, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setEditingWorkshop(null)}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              maxWidth: 650,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#f9fafb" }}>
                {isNew ? "Create New Workshop" : `Edit Workshop: ${editingWorkshop.title}`}
              </h3>
              <button
                onClick={() => setEditingWorkshop(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Workshop Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.title}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Slug (URL identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.slug}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                  Headline Summary
                </label>
                <input
                  type="text"
                  value={editingWorkshop.headline || ""}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, headline: e.target.value })}
                  placeholder="e.g. Learn to use AI tools practically with zero coding required."
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingWorkshop.description}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingWorkshop.price_inr}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, price_inr: Number(e.target.value) })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingWorkshop.original_price_inr || 2999}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, original_price_inr: Number(e.target.value) })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Duration (Hours) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingWorkshop.course_duration_hours}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, course_duration_hours: Number(e.target.value) })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Difficulty Level
                  </label>
                  <select
                    value={editingWorkshop.difficulty_level}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, difficulty_level: e.target.value })}
                    style={{ width: "100%", background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Publish Status
                  </label>
                  <select
                    value={editingWorkshop.status}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, status: e.target.value })}
                    style={{ width: "100%", background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.375rem" }}>
                  Key Features / Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={editingWorkshop.featuresStr}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, featuresStr: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingWorkshop(null)}
                  style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#cbd5e1", borderRadius: 8, padding: "0.75rem 1.25rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: "#1e6fff", border: "none", color: "#fff", borderRadius: 8, padding: "0.75rem 1.5rem", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Workshop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingWorkshop && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 15, 30, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setDeletingWorkshop(null)}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 20,
              maxWidth: 480,
              width: "100%",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(239, 68, 68, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#f9fafb" }}>
                Delete Workshop?
              </h3>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "0.9375rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
              Are you sure you want to delete <strong style={{ color: "#f9fafb" }}>&quot;{deletingWorkshop.title}&quot;</strong>? This action cannot be undone and will remove it from the catalog.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setDeletingWorkshop(null)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  color: "#cbd5e1",
                  borderRadius: 10,
                  padding: "0.75rem 1.25rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                style={{
                  background: "#ef4444",
                  border: "none",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0.75rem 1.5rem",
                  cursor: deleting ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {deleting ? "Deleting..." : "Yes, Delete Workshop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
