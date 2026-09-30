import { createClient, createAdminClient } from "@/lib/supabase/server";

export interface UserSessionProfile {
  user: any;
  profile: {
    id: string;
    email: string;
    full_name?: string;
    role: "student" | "admin" | "super_admin" | "course_admin" | "content_manager";
  } | null;
  studentProfile: {
    id: string;
    student_id: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    profile_complete: boolean;
  } | null;
}

export async function getCurrentUser(): Promise<UserSessionProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch user role & profile
    const { data: profile } = await supabase
      .from("users")
      .select("id, email, full_name, role")
      .eq("id", user.id)
      .single();

    // Fetch student profile
    const { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return {
      user,
      profile: profile || {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
        role: "student",
      },
      studentProfile,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getCurrentUser();
  if (!session || !session.profile) {
    throw new Error("Unauthorized");
  }

  const allowedRoles = ["admin", "super_admin", "course_admin"];
  if (!allowedRoles.includes(session.profile.role)) {
    throw new Error("Forbidden: Admin privileges required");
  }

  return session;
}
