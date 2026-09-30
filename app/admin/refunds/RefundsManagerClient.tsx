"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, AlertTriangle, Loader2, X } from "lucide-react";

interface RefundsManagerClientProps {
  initialTransactions: any[];
}

export default function RefundsManagerClient({ initialTransactions }: RefundsManagerClientProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");

  const handleOpenRefundModal = (tx: any) => {
    setSelectedTx(tx);
    setReason("Student requested refund within policy window");
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx) return;

    setProcessing(true);
    setMsg("");

    try {
      const res = await fetch("/api/admin/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: selectedTx.id,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process refund");

      setMsg("Refund processed successfully!");
      setSelectedTx(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to process refund");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {msg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "1rem", borderRadius: 12, marginBottom: "1.5rem" }}>
          {msg}
        </div>
      )}

      <div
        style={{
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 18,
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#64748b" }}>
              <th style={{ padding: "1rem 1.25rem" }}>Student</th>
              <th style={{ padding: "1rem 1.25rem" }}>Student ID</th>
              <th style={{ padding: "1rem 1.25rem" }}>Course</th>
              <th style={{ padding: "1rem 1.25rem" }}>Amount</th>
              <th style={{ padding: "1rem 1.25rem" }}>Bank UTR / Ref</th>
              <th style={{ padding: "1rem 1.25rem" }}>Status</th>
              <th style={{ padding: "1rem 1.25rem" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ fontWeight: 700, color: "#f9fafb" }}>{tx.student_name || "Learner"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{tx.student_email}</div>
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "#f5a623", fontFamily: "monospace", fontWeight: 700 }}>
                  {tx.student_id_code || "PCL-MEMBER"}
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1" }}>
                  {tx.courses?.title || "Masterclass"}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: tx.status === "refunded" ? "#ef4444" : "#10b981" }}>
                  ₹{tx.amount_inr}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontFamily: "monospace", color: "#94a3b8" }}>
                  {tx.razorpay_utr_id || "UTR-VERIFIED"}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span
                    style={{
                      background: tx.status === "refunded" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: tx.status === "refunded" ? "#ef4444" : "#10b981",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.5rem",
                      borderRadius: 4,
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  {tx.status === "success" ? (
                    <button
                      onClick={() => handleOpenRefundModal(tx)}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#fca5a5",
                        padding: "0.4rem 0.75rem",
                        borderRadius: 6,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <RotateCcw size={12} /> Issue Refund
                    </button>
                  ) : (
                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Confirmation Modal */}
      {selectedTx && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 15, 30, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 20,
              maxWidth: 480,
              width: "100%",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", fontWeight: 800 }}>
                <AlertTriangle size={20} /> Confirm Refund
              </div>
              <button onClick={() => setSelectedTx(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
              Are you sure you want to refund <strong style={{ color: "#f9fafb" }}>₹{selectedTx.amount_inr}</strong> to <strong style={{ color: "#f9fafb" }}>{selectedTx.student_name}</strong> ({selectedTx.student_email})? This will call Razorpay and revoke course access.
            </p>

            <form onSubmit={handleProcessRefund} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  Refund Reason / Notes
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.625rem", color: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "0.75rem", borderRadius: 8, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  style={{ flex: 2, background: "#ef4444", border: "none", color: "#fff", padding: "0.75rem", borderRadius: 8, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  {processing ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Process Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
