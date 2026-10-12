import { createAdminClient } from "@/lib/supabase/server";
import WorkshopManagerClient from "./WorkshopManagerClient";
import { Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminWorkshopsPage() {
  const adminSupabase = await createAdminClient();

  const { data: workshops } = await adminSupabase
    .from("courses")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(30, 111, 255, 0.15)", border: "1px solid rgba(30, 111, 255, 0.3)", color: "#60a5fa", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
          <Sparkles size={14} /> WORKSHOP & MASTERCLASS CATALOG
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Workshop Management
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Create, edit, and publish live interactive workshops. Manage workshop duration, pricing, curriculum, and public visibility.
        </p>
      </div>

      <WorkshopManagerClient initialWorkshops={workshops || []} />
    </div>
  );
}
