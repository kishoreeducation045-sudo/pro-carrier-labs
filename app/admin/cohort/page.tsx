import { createAdminClient } from "@/lib/supabase/server";
import CohortEditorClient from "./CohortEditorClient";
import { Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminCohortPage() {
  const adminSupabase = await createAdminClient();

  const { data: cohort } = await adminSupabase
    .from("cohort_settings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch homepage-related site_settings
  const { data: settingsRows } = await adminSupabase
    .from("site_settings")
    .select("key, value")
    .in("key", [
      "hero_headline",
      "hero_subheadline",
      "hero_badge_text",
      "hero_cta_text",
      "hero_rating_value",
      "hero_rating_label",
      "hero_students_count",
      "hero_students_label",
      "hero_image_url",
      "stat1_value",
      "stat1_label",
      "stat2_value",
      "stat2_label",
      "stat3_value",
      "stat3_label",
      "stat4_value",
      "stat4_label",
    ]);

  const initialSettings: Record<string, string> = Object.fromEntries(
    (settingsRows ?? []).map((r: any) => [r.key, r.value ?? ""])
  );

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(245, 166, 35, 0.15)",
            border: "1px solid rgba(245, 166, 35, 0.3)",
            color: "#f5a623",
            fontSize: "0.75rem",
            fontWeight: 800,
            padding: "0.25rem 0.625rem",
            borderRadius: 9999,
            marginBottom: "0.5rem",
          }}
        >
          <Sparkles size={14} /> HOMEPAGE AND COHORT
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Homepage & Cohort Controller
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Manage hero copy, hero image, stats counters, live cohort schedule, pricing and seat availability — every change instantly updates the public homepage.
        </p>
      </div>

      <CohortEditorClient initialCohort={cohort} initialSettings={initialSettings} />
    </div>
  );
}
