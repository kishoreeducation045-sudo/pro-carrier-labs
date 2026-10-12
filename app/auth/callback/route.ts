import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", origin));
  }

  // Use next/headers cookies() — in a Route Handler, this writes Set-Cookie
  // headers to the response automatically, so the browser receives the session.
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore if can't set (shouldn't happen in Route Handler)
            }
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    console.error("[auth/callback] Exchange error:", error?.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || "auth_failed")}`, origin)
    );
  }

  const email = data.user.email?.toLowerCase() || "";
  const fullName =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.name ||
    email.split("@")[0];

  let targetDestination = "/";

  try {
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: existingUser } = await adminSupabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    let assignedRole = existingUser?.role;

    if (!assignedRole) {
      assignedRole = isAdminEmail(email) ? "super_admin" : "student";

      await adminSupabase.from("users").upsert(
        {
          id: data.user.id,
          email,
          full_name: fullName,
          role: assignedRole,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    // Upsert student profile for non-admins
    if (!["admin", "super_admin", "course_admin", "content_manager"].includes(assignedRole || "")) {
      const studentId = `PCL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      await adminSupabase.from("student_profiles").upsert(
        { user_id: data.user.id, student_id: studentId, profile_complete: false },
        { onConflict: "user_id" }
      );
    }

    // Sync role to auth app_metadata for fast token checks
    try {
      await adminSupabase.auth.admin.updateUserById(data.user.id, {
        app_metadata: { role: assignedRole },
      });
    } catch {}

    const isAdmin =
      isAdminEmail(email) ||
      ["admin", "super_admin", "course_admin", "content_manager"].includes(assignedRole || "");

    if (isAdmin) {
      targetDestination = next && next.startsWith("/admin") ? next : "/admin";
    } else {
      targetDestination = "/";
    }
  } catch (syncErr) {
    console.warn("[auth/callback] User sync warning:", syncErr);
    // Fall back to email-based role check
    const isAdmin = isAdminEmail(email);
    targetDestination = isAdmin ? (next && next.startsWith("/admin") ? next : "/admin") : "/";
  }

  console.log(`[auth/callback] ${email} → ${targetDestination}`);

  return NextResponse.redirect(new URL(targetDestination, origin));
}
