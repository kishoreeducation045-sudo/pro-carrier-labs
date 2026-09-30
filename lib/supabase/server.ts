import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — can't set cookies, ignore
          }
        },
      },
    }
  );
}

/** Service-role client — bypasses RLS. Use only in trusted server contexts. */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

/** Get authenticated user or fallback to dev auth cookie */
export async function getEffectiveUser() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return user;
  } catch {}

  const devCookie = cookieStore.get("pcl_dev_auth");
  if (devCookie?.value) {
    try {
      const dev = JSON.parse(devCookie.value);
      return {
        id: dev.id || "usr_dev_1001",
        email: dev.email || "admin@procareerlabs.com",
        user_metadata: {
          full_name: dev.name || dev.email?.split("@")[0] || "Admin",
          role: dev.role || "super_admin",
        },
      } as any;
    } catch {}
  }
  return null;
}
