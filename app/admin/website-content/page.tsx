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

  return <WebsiteContentClient initialSettings={settingsMap} />;
}
