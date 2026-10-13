"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Mail,
  Copy,
  Check,
  Download,
  Shield,
  GraduationCap,
  Sparkles,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export interface UserItem {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  studentId?: string | null;
  phone?: string | null;
  city?: string | null;
  enrolledCount: number;
}

interface UsersTableClientProps {
  initialUsers: UserItem[];
}

export default function UsersTableClient({ initialUsers }: UsersTableClientProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "admin">("all");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Copy Email to clipboard
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      // Role filter
      if (roleFilter === "student" && u.role !== "student") return false;
      if (roleFilter === "admin" && u.role === "student") return false;

      // Text search
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchStudentId = u.studentId?.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q);
      return matchName || matchEmail || matchStudentId || matchPhone;
    });
  }, [initialUsers, search, roleFilter]);

  // Statistics
  const totalCount = initialUsers.length;
  const studentCount = initialUsers.filter((u) => u.role === "student").length;
  const adminCount = initialUsers.filter((u) => u.role !== "student").length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Full Name", "Email", "Role", "Student ID", "Phone", "Workshops Enrolled", "Registered Date"];
    const rows = filteredUsers.map((u) => [
      `"${u.fullName.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.studentId || ""}"`,
      `"${u.phone || ""}"`,
      u.enrolledCount,
      `"${new Date(u.createdAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pcl_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date helper
  const formatDate = (iso: string) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  };

  // Helper for role badges
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(245, 166, 35, 0.2))",
              border: "1px solid rgba(245, 166, 35, 0.4)",
              color: "#f5a623",
              fontSize: "0.75rem",
              fontWeight: 800,
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
            }}
          >
            👑 Super Admin
          </span>
        );
      case "admin":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "rgba(30, 111, 255, 0.18)",
              border: "1px solid rgba(30, 111, 255, 0.4)",
              color: "#60a5fa",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
            }}
          >
            🛡️ Admin
          </span>
        );
      case "course_admin":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "rgba(6, 182, 212, 0.18)",
              border: "1px solid rgba(6, 182, 212, 0.4)",
              color: "#22d3ee",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
            }}
          >
            📚 Workshop Admin
          </span>
        );
      case "content_manager":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "rgba(16, 185, 129, 0.18)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34d399",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
            }}
          >
            ✏️ Content Manager
          </span>
        );
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "rgba(148, 163, 184, 0.12)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              color: "#cbd5e1",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.25rem 0.625rem",
              borderRadius: 9999,
            }}
          >
            🎓 Student
          </span>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {/* Card 1: Total Users */}
        <div
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(30, 111, 255, 0.15)",
              border: "1px solid rgba(30, 111, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#60a5fa",
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <span style={{ color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase" }}>
              Total Logged-In Users
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#f9fafb", lineHeight: 1.2 }}>
              {totalCount}
            </div>
          </div>
        </div>

        {/* Card 2: Students */}
        <div
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10b981",
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase" }}>
              Students / Learners
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#f9fafb", lineHeight: 1.2 }}>
              {studentCount}
            </div>
          </div>
        </div>

        {/* Card 3: Admins */}
        <div
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(245, 166, 35, 0.15)",
              border: "1px solid rgba(245, 166, 35, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f5a623",
            }}
          >
            <Shield size={24} />
          </div>
          <div>
            <span style={{ color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase" }}>
              Admins & Staff
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#f9fafb", lineHeight: 1.2 }}>
              {adminCount}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, and Export */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 16,
          padding: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", flex: "1 1 320px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          />
          <input
            type="text"
            placeholder="Search by full name, email, or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 10,
              padding: "0.625rem 1rem 0.625rem 2.75rem",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>

        {/* Filter Pills & Export */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Filter Pills */}
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "0.25rem",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              style={{
                background: roleFilter === "all" ? "#1e6fff" : "transparent",
                color: roleFilter === "all" ? "#fff" : "#94a3b8",
                border: "none",
                borderRadius: 7,
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("student")}
              style={{
                background: roleFilter === "student" ? "#1e6fff" : "transparent",
                color: roleFilter === "student" ? "#fff" : "#94a3b8",
                border: "none",
                borderRadius: 7,
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Students ({studentCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("admin")}
              style={{
                background: roleFilter === "admin" ? "#1e6fff" : "transparent",
                color: roleFilter === "admin" ? "#fff" : "#94a3b8",
                border: "none",
                borderRadius: 7,
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Admins ({adminCount})
            </button>
          </div>

          {/* Export to CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              fontSize: "0.8125rem",
              fontWeight: 600,
              padding: "0.5rem 1rem",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <th style={{ padding: "1rem 1.5rem" }}>User / Name</th>
                <th style={{ padding: "1rem 1.5rem" }}>Email Address</th>
                <th style={{ padding: "1rem 1.5rem" }}>Role</th>
                <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem" }}>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "4rem 1.5rem", textAlign: "center", color: "#64748b" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <Users size={36} color="#475569" />
                      <p style={{ margin: "0.5rem 0 0", fontSize: "1rem", color: "#94a3b8", fontWeight: 600 }}>
                        No users found
                      </p>
                      <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                        Try clearing or adjusting your search query.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";
                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        background: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(30, 111, 255, 0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)";
                      }}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName}
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 9999,
                                objectFit: "cover",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 9999,
                                background: "linear-gradient(135deg, #1e6fff, #7928ca)",
                                color: "#fff",
                                fontWeight: 800,
                                fontSize: "0.9375rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {initial}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: "#f9fafb", fontSize: "0.9375rem" }}>
                              {user.fullName}
                            </div>
                            {user.studentId && (
                              <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 500, marginTop: "2px" }}>
                                ID: <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{user.studentId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{user.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(user.email)}
                            title="Copy Email"
                            style={{
                              background: copiedEmail === user.email ? "rgba(16, 185, 129, 0.2)" : "transparent",
                              border: "none",
                              color: copiedEmail === user.email ? "#10b981" : "#64748b",
                              padding: "0.25rem",
                              borderRadius: 4,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {copiedEmail === user.email ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: "1rem 1.5rem" }}>{renderRoleBadge(user.role)}</td>

                      {/* Status */}
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: user.isActive ? "#10b981" : "#ef4444",
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 9999,
                              background: user.isActive ? "#10b981" : "#ef4444",
                              boxShadow: user.isActive ? "0 0 8px #10b981" : "none",
                            }}
                          />
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td style={{ padding: "1rem 1.5rem", color: "#94a3b8", fontSize: "0.8125rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                          <Calendar size={13} color="#64748b" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            background: "rgba(255, 255, 255, 0.01)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#64748b",
            fontSize: "0.8125rem",
          }}
        >
          <span>
            Showing <strong style={{ color: "#e2e8f0" }}>{filteredUsers.length}</strong> of{" "}
            <strong style={{ color: "#e2e8f0" }}>{totalCount}</strong> registered users
          </span>
          <span style={{ fontSize: "0.75rem" }}>Encrypted Supabase Authentication</span>
        </div>
      </div>
    </div>
  );
}
