import { createAdminClient } from "@/lib/supabase/server";
import { Shield } from "lucide-react";

export const revalidate = 0;

export default async function AdminRolesPage() {
  const adminSupabase = await createAdminClient();

  const { data: admins } = await adminSupabase
    .from("users")
    .select("*")
    .in("role", ["admin", "super_admin", "course_admin", "content_manager"]);

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 166, 35, 0.15)", border: "1px solid rgba(245, 166, 35, 0.3)", color: "#f5a623", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
          <Shield size={14} /> SECURITY & ACCESS CONTROL
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Admin & Staff Role Management
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Manage administrator permissions, view authorized staff members, and configure access policies.
        </p>
      </div>

      <div
        style={{
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#64748b" }}>
              <th style={{ padding: "1rem 1.25rem" }}>Staff Member</th>
              <th style={{ padding: "1rem 1.25rem" }}>Email</th>
              <th style={{ padding: "1rem 1.25rem" }}>Role</th>
              <th style={{ padding: "1rem 1.25rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(!admins || admins.length === 0) ? (
              <tr>
                <td colSpan={4} style={{ padding: "2.5rem", textAlign: "center", color: "#64748b" }}>
                  No extra admin roles found in database. System defaults are active.
                </td>
              </tr>
            ) : (
              admins.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "#f9fafb" }}>
                    {adm.full_name || "Admin User"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#94a3b8" }}>
                    {adm.email}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span
                      style={{
                        background: "rgba(245, 166, 35, 0.15)",
                        border: "1px solid rgba(245, 166, 35, 0.3)",
                        color: "#f5a623",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "0.25rem 0.5rem",
                        borderRadius: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {adm.role}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ color: "#10b981", fontSize: "0.8125rem", fontWeight: 700 }}>
                      ● Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
