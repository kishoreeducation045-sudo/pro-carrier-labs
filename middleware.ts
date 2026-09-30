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

  if (isStudentRoute && !effectiveUser) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Protected admin routes ────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!effectiveUser) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const email = effectiveUser.email || "";
    const isSuperAdmin =
      isAdminEmail(email) ||
      (devUser && (devUser.role === "super_admin" || devUser.role === "admin"));

    if (!isSuperAdmin && user && isSupabaseConfigured) {
      try {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() { return request.cookies.getAll(); },
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
          !profile ||
          !["admin", "super_admin", "course_admin", "content_manager"].includes(profile.role)
        ) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        // If DB fails, allow through if dev admin
        if (!devUser) return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // ── Redirect logged-in users away from auth pages ─────────
  if ((pathname === "/login" || pathname === "/signup") && effectiveUser) {
    const email = effectiveUser.email || "";
    const isSuperAdmin =
      isAdminEmail(email) ||
      (devUser && (devUser.role === "super_admin" || devUser.role === "admin"));

    const dest = isSuperAdmin ? "/admin" : "/dashboard";
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
