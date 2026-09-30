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

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 166, 35, 0.15)", border: "1px solid rgba(245, 166, 35, 0.3)", color: "#f5a623", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
          <Sparkles size={14} /> HOMEPAGE FEATURED COHORT
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Live Cohort & Countdown Controller
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Every detail saved here instantly updates the marketing homepage hero banner, countdown timer clock, remaining seats meter, discounted price, and Zoom access link.
        </p>
      </div>

      <CohortEditorClient initialCohort={cohort} />
    </div>
  );
}
