"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Clock, Eye, Save, X, Loader2, Trash2, AlertTriangle } from "lucide-react";

interface CourseManagerClientProps {
  initialCourses: any[];
}

export default function CourseManagerClient({ initialCourses }: CourseManagerClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;
    setDeleting(true);
    setMsg("");

    try {
      const res = await fetch(`/api/admin/courses?id=${deletingCourse.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete course");

      setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
      setMsg(`Course "${deletingCourse.title}" was successfully deleted.`);
      setDeletingCourse(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (course: any) => {
    setIsNew(false);
    setEditingCourse({
      ...course,
      featuresStr: Array.isArray(course.features) ? course.features.join("\n") : "",
    });
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingCourse({
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
      featuresStr: "Live Interactive Masterclass\nPrompt Vault Access\nAutonomous Agent Blueprint\nVerifiable Certificate",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const features = editingCourse.featuresStr
      ? editingCourse.featuresStr.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingCourse,
          features,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save course");

      setMsg("Course saved successfully!");
      setEditingCourse(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
          All Active Masterclasses ({courses.length})
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
          }}
        >
          <Plus size={16} /> Add New Course
        </button>
      </div>

      {msg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "0.875rem 1rem", borderRadius: 10, marginBottom: "1rem" }}>
          {msg}
        </div>
      )}

      {/* Course Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {courses.map((course) => (
          <div
            key={course.id}
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
                  {course.category}
                </span>
                <span style={{ fontSize: "0.75rem", color: course.status === "published" ? "#10b981" : "#64748b", fontWeight: 700 }}>
                  ● {course.status}
                </span>
              </div>

              <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
                {course.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1rem", lineHeight: 1.5 }}>
                {course.headline || course.description}
              </p>

              <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "#64748b", marginBottom: "1rem" }}>
                <span><Clock size={13} style={{ display: "inline", marginRight: 4 }} />{course.course_duration_hours}h</span>
                <span>Slug: <strong style={{ color: "#cbd5e1" }}>{course.slug}</strong></span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#10b981" }}>
                ₹{course.price_inr}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  title="View Public Page"
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
                  onClick={() => handleEdit(course)}
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
                  <Edit2 size={14} /> Edit Course
                </button>

                <button
                  onClick={() => setDeletingCourse(course)}
                  title="Delete Course"
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
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(239, 68, 68, 0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(239, 68, 68, 0.12)";
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
      {editingCourse && (
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
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                {isNew ? "Create New Masterclass" : `Edit Course: ${editingCourse.title}`}
              </h3>
              <button onClick={() => setEditingCourse(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Course Title *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="input-field"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.slug}
                    onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                    className="input-field"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Category</label>
                  <input
                    type="text"
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="input-field"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.price_inr}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price_inr: e.target.value })}
                    className="input-field"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#10b981", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Duration (Hours)</label>
                  <input
                    type="number"
                    value={editingCourse.course_duration_hours}
                    onChange={(e) => setEditingCourse({ ...editingCourse, course_duration_hours: e.target.value })}
                    className="input-field"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Headline Summary</label>
                <input
                  type="text"
                  value={editingCourse.headline}
                  onChange={(e) => setEditingCourse({ ...editingCourse, headline: e.target.value })}
                  className="input-field"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Google Drive Video Embed URL</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../preview"
                  value={editingCourse.drive_url || ""}
                  onChange={(e) => setEditingCourse({ ...editingCourse, drive_url: e.target.value })}
                  className="input-field"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={editingCourse.featuresStr}
                  onChange={(e) => setEditingCourse({ ...editingCourse, featuresStr: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem 0.875rem", color: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "0.625rem 1.25rem", borderRadius: 8, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: "#1e6fff", border: "none", color: "#fff", padding: "0.625rem 1.5rem", borderRadius: 8, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 20,
              padding: "2rem",
              maxWidth: 460,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#f9fafb" }}>
                  Delete Course
                </h3>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>Permanent action</span>
              </div>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "0.9375rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
              Are you sure you want to permanently delete <strong style={{ color: "#f9fafb" }}>"{deletingCourse.title}"</strong>? This will remove the course and its curriculum from the platform.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                disabled={deleting}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  padding: "0.625rem 1.25rem",
                  borderRadius: 10,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                style={{
                  background: "#ef4444",
                  border: "none",
                  color: "#ffffff",
                  padding: "0.625rem 1.25rem",
                  borderRadius: 10,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: deleting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Yes, Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
