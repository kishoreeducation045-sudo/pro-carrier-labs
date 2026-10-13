import { createAdminClient } from "@/lib/supabase/server";
import UsersTableClient from "./UsersTableClient";
import { UserCheck, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const adminSupabase = await createAdminClient();

  // Fetch all registered users
  const { data: users, error: usersError } = await adminSupabase
    .from("users")
    .select("id, email, full_name, avatar_url, role, is_active, created_at")
    .order("created_at", { ascending: false });

  // Fetch student profiles for additional details (phone, student_id)
  const { data: profiles } = await adminSupabase
    .from("student_profiles")
    .select("user_id, student_id, phone, city, state");

  // Fetch enrollments count per user
  const { data: enrollments } = await adminSupabase
    .from("enrollments")
    .select("user_id");

  // Map profiles and enrollments onto user records
  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
  const enrollmentCountMap = new Map<string, number>();
  (enrollments || []).forEach((e: any) => {
    if (e.user_id) {
      enrollmentCountMap.set(e.user_id, (enrollmentCountMap.get(e.user_id) || 0) + 1);
    }
  });

  const enrichedUsers = (users || []).map((u: any) => {
    const prof = profileMap.get(u.id);
    return {
      id: u.id,
      email: u.email,
      fullName: u.full_name || "Anonymous",
      avatarUrl: u.avatar_url,
      role: u.role || "student",
      isActive: u.is_active ?? true,
      createdAt: u.created_at,
      studentId: prof?.student_id || null,
      phone: prof?.phone || null,
      city: prof?.city || null,
      enrolledCount: enrollmentCountMap.get(u.id) || 0,
    };
  });

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(30, 111, 255, 0.15)",
            border: "1px solid rgba(30, 111, 255, 0.3)",
            color: "#60a5fa",
            fontSize: "0.75rem",
            fontWeight: 800,
            padding: "0.25rem 0.625rem",
            borderRadius: 9999,
            marginBottom: "0.5rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <UserCheck size={14} /> USER DIRECTORY
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 900,
            margin: "0 0 0.5rem",
            letterSpacing: "-0.02em",
            color: "#f9fafb",
          }}
        >
          Users & Details
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0, maxWidth: 750 }}>
          Central live registry of every user who has logged in to the platform. View their registered name, verified email address, roles, and account activity.
        </p>
      </div>

      <UsersTableClient initialUsers={enrichedUsers} />
    </div>
  );
}
