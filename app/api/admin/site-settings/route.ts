import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const adminSupabase = await createAdminClient();
    const { data: settings, error } = await adminSupabase
      .from("site_settings")
      .select("*");

    if (error) throw error;
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body; // Array of { key, value, label }

    if (Array.isArray(settings)) {
      for (const item of settings) {
        await adminSupabase
          .from("site_settings")
          .upsert(
            {
              key: item.key,
              value: typeof item.value === "string" ? item.value : JSON.stringify(item.value),
              label: item.label,
              updated_by: user.id,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" }
          );
      }
    }

    return NextResponse.json({ success: true, message: "Site settings updated" });
  } catch (error: any) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
