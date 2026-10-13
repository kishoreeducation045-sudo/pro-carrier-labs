import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import WebsiteContentClient from "./WebsiteContentClient";

export const revalidate = 0;

interface SettingRow {
  key: string;
  value: string;
}

export default async function WebsiteContentPage() {
  const adminSupabase = await createAdminClient();

  const { data: settings } = await adminSupabase
    .from("site_settings")
    .select("key, value");

  const settingsList = (settings ?? []) as SettingRow[];
  const settingsMap: Record<string, string> = Object.fromEntries(
    settingsList.map((s) => [s.key, s.value])
  );

  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#94a3b8" }}>Loading Website Content...</div>}>
      <WebsiteContentClient initialSettings={settingsMap} />
    </Suspense>
  );
}
