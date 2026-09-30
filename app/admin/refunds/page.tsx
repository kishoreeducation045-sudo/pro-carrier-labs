import { createAdminClient } from "@/lib/supabase/server";
import RefundsManagerClient from "./RefundsManagerClient";
import { RotateCcw, ShieldAlert } from "lucide-react";

export const revalidate = 0;

export default async function AdminRefundsPage() {
  const adminSupabase = await createAdminClient();

  const { data: transactions } = await adminSupabase
    .from("transactions")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
          <RotateCcw size={14} /> TRANSACTION RECONCILIATION
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Refunds & Acquirer UTR Management
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Manage payments, reverse charges via Razorpay, and audit bank UTR transaction references.
        </p>
      </div>

      <RefundsManagerClient initialTransactions={transactions || []} />
    </div>
  );
}
