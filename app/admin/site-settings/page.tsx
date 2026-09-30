import { createAdminClient } from "@/lib/supabase/server";
import SiteSettingsClient from "./SiteSettingsClient";
import { Sliders, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminSiteSettingsPage() {
  const adminSupabase = await createAdminClient();

  const { data: settings } = await adminSupabase
    .from("site_settings")
    .select("*");

  const settingsMap = Object.fromEntries(
    (settings ?? []).map((s: any) => [s.key, s.value])
  );

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(30, 111, 255, 0.15)", border: "1px solid rgba(30, 111, 255, 0.3)", color: "#60a5fa", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
          <Sliders size={14} /> DYNAMIC PLATFORM METRICS
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Marquee Ticker & Social Proof Settings
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Manage top notification ticker announcements and public trust statistics displayed across the marketing homepage.
        </p>
      </div>

      <SiteSettingsClient initialSettings={settingsMap} />
    </div>
  );
}
