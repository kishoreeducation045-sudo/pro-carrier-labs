import { redirect } from "next/navigation";
import { createClient, createAdminClient, getEffectiveUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminSupabase = await createAdminClient();
  const user = await getEffectiveUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: profile } = await adminSupabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin =
    isAdminEmail(user.email) ||
    ["admin", "super_admin", "course_admin", "content_manager"].includes(profile?.role);

  if (!isAdmin) {
    // If not admin, redirect to student dashboard
    redirect("/dashboard");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}
