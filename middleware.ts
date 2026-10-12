import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build a response that we can attach cookies to
  let response = NextResponse.next({ request });

  // ── Check dev authentication bypass (for instant local testing) ──
  const devAuthCookie = request.cookies.get("pcl_dev_auth");
  let devUser: { email?: string; role?: string; id?: string } | null = null;
  if (devAuthCookie?.value) {
    try {
      devUser = JSON.parse(devAuthCookie.value);
    } catch {
      // ignore JSON parse error
    }
  }

  let user = null;

  // Attempt Supabase auth if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT");

  if (isSupabaseConfigured) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set(name, value);
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Fallback if supabase connection is unreachable
      user = null;
    }
  }

  const effectiveUser = user || devUser;

  // ── Protected student routes ──────────────────────────────
  const studentRoutes = ["/dashboard", "/my-courses", "/certificates"];
  const isStudentRoute = studentRoutes.some((r) => pathname.startsWith(r));

  if (isStudentRoute) {
    // Workshops replaced legacy courses/dashboard — redirect directly to main page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── Protected admin routes ────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!effectiveUser) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const email = effectiveUser.email || "";
    let isSuperAdmin =
      isAdminEmail(email) ||
      (devUser && (devUser.role === "super_admin" || devUser.role === "admin")) ||
      (user?.app_metadata?.role &&
        ["admin", "super_admin", "course_admin", "content_manager"].includes(
          user.app_metadata.role
        )) ||
      (user?.user_metadata?.role &&
        ["admin", "super_admin", "course_admin", "content_manager"].includes(
          user.user_metadata.role
        ));

    if (!isSuperAdmin && user && isSupabaseConfigured) {
      try {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return request.cookies.getAll();
              },
              setAll() {},
            },
          }
        );
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (
          profile &&
          ["admin", "super_admin", "course_admin", "content_manager"].includes(
            profile.role
          )
        ) {
          isSuperAdmin = true;
        }
      } catch {}
    }

    if (!isSuperAdmin) {
      // Non-admin credentials redirect directly to main page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Redirect logged-in users away from auth pages ─────────
  if ((pathname === "/login" || pathname === "/signup") && effectiveUser) {
    const email = effectiveUser.email || "";
    let isSuperAdmin =
      isAdminEmail(email) ||
      (devUser && (devUser.role === "super_admin" || devUser.role === "admin")) ||
      (user?.app_metadata?.role &&
        ["admin", "super_admin", "course_admin", "content_manager"].includes(
          user.app_metadata.role
        )) ||
      (user?.user_metadata?.role &&
        ["admin", "super_admin", "course_admin", "content_manager"].includes(
          user.user_metadata.role
        ));

    if (!isSuperAdmin && user && isSupabaseConfigured) {
      try {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return request.cookies.getAll();
              },
              setAll() {},
            },
          }
        );
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (
          profile &&
          ["admin", "super_admin", "course_admin", "content_manager"].includes(
            profile.role
          )
        ) {
          isSuperAdmin = true;
        }
      } catch {}
    }

    const dest = isSuperAdmin ? "/admin" : "/";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-courses/:path*",
    "/certificates/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
