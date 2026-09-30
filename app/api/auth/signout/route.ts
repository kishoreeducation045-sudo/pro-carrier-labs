import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function clearAuthCookies(response: NextResponse, request: NextRequest) {
  // Clear dev auth cookie
  response.cookies.set("pcl_dev_auth", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  // Clear all supabase cookies matching sb-*
  const allCookies = request.cookies.getAll();
  allCookies.forEach((c) => {
    if (c.name.startsWith("sb-") || c.name.includes("auth-token")) {
      response.cookies.set(c.name, "", {
        path: "/",
        expires: new Date(0),
        maxAge: 0,
      });
    }
  });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearAuthCookies(response, request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT")) {
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
                response.cookies.set(name, value, { ...options, maxAge: 0, expires: new Date(0) });
              });
            },
          },
        }
      );
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signout error in Supabase:", e);
    }
  }

  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/login", url.origin));
  clearAuthCookies(response, request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT")) {
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
                response.cookies.set(name, value, { ...options, maxAge: 0, expires: new Date(0) });
              });
            },
          },
        }
      );
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signout error in Supabase:", e);
    }
  }

  return response;
}
