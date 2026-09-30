import { createAdminClient } from "@/lib/supabase/server";
import StudentTableClient from "./StudentTableClient";
import { Users, Receipt, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminStudentsPage() {
  const adminSupabase = await createAdminClient();

  // Fetch all transactions with profile details
  const { data: transactions } = await adminSupabase
    .from("transactions")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  // Fetch all student profiles
  const { data: profiles } = await adminSupabase
    .from("student_profiles")
    .select("*, users(email, full_name)")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
          <ShieldCheck size={14} /> VERIFIED DIRECTORY
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Students, Profiles & Bank UTR Receipts
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
          Live central directory containing unique Student IDs, phone numbers, addresses, and Razorpay Acquirer UTR numbers for auditing.
        </p>
      </div>

      <StudentTableClient
        initialTransactions={transactions || []}
        initialProfiles={profiles || []}
      />
    </div>
  );
}
