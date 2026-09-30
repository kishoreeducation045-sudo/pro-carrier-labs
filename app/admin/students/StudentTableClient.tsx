"use client";
import { useState } from "react";
import { Search, Phone, MapPin, Mail, Copy, Check } from "lucide-react";

interface StudentTableClientProps {
  initialTransactions: any[];
  initialProfiles: any[];
}

export default function StudentTableClient({
  initialTransactions,
  initialProfiles,
}: StudentTableClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const filteredTransactions = initialTransactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    return (
      tx.student_name?.toLowerCase().includes(term) ||
      tx.student_email?.toLowerCase().includes(term) ||
      tx.student_phone?.toLowerCase().includes(term) ||
      tx.student_id_code?.toLowerCase().includes(term) ||
      tx.razorpay_utr_id?.toLowerCase().includes(term) ||
      tx.razorpay_order_id?.toLowerCase().includes(term) ||
      tx.student_address?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Search Bar & Export */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", minWidth: 320, flex: 1, maxWidth: 480 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            type="text"
            placeholder="Search by Student ID, Name, Email, Phone, or UTR number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 10,
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              color: "#fff",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
          Showing <strong>{filteredTransactions.length}</strong> records
        </div>
      </div>

      {/* Table */}
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
              <th style={{ padding: "1rem 1.25rem" }}>Student ID</th>
              <th style={{ padding: "1rem 1.25rem" }}>Name & Email</th>
              <th style={{ padding: "1rem 1.25rem" }}>Phone & Address</th>
              <th style={{ padding: "1rem 1.25rem" }}>Enrolled Course</th>
              <th style={{ padding: "1rem 1.25rem" }}>Bank UTR / Ref ID</th>
              <th style={{ padding: "1rem 1.25rem" }}>Amount</th>
              <th style={{ padding: "1rem 1.25rem" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  No students or transactions match your search query.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  {/* Student ID */}
                  <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        background: "rgba(245, 166, 35, 0.15)",
                        border: "1px solid rgba(245, 166, 35, 0.3)",
                        color: "#f5a623",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        fontSize: "0.8125rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: 6,
                      }}
                    >
                      {tx.student_id_code || "PCL-MEMBER"}
                    </span>
                  </td>

                  {/* Name & Email */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ fontWeight: 700, color: "#f9fafb" }}>
                      {tx.student_name || "Learner"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Mail size={12} /> {tx.student_email}
                    </div>
                  </td>

                  {/* Phone & Address */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ color: "#60a5fa", fontSize: "0.8125rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Phone size={12} /> {tx.student_phone || "Not provided"}
                    </div>
                    {tx.student_address && (
                      <div style={{ fontSize: "0.75rem", color: "#64748b", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: 2 }}>
                        <MapPin size={12} /> {tx.student_address}
                      </div>
                    )}
                  </td>

                  {/* Course */}
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", fontSize: "0.8125rem" }}>
                    {tx.courses?.title || "AI Masterclass"}
                  </td>

                  {/* UTR ID */}
                  <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.8125rem",
                          color: "#10b981",
                          background: "rgba(16, 185, 129, 0.1)",
                          padding: "0.2rem 0.4rem",
                          borderRadius: 4,
                        }}
                      >
                        {tx.razorpay_utr_id || tx.razorpay_payment_id || "UTR-VERIFIED"}
                      </span>
                      <button
                        onClick={() => handleCopy(tx.razorpay_utr_id || tx.razorpay_payment_id || "")}
                        title="Copy UTR ID"
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedUtr === (tx.razorpay_utr_id || tx.razorpay_payment_id) ? "#10b981" : "#64748b",
                          cursor: "pointer",
                          padding: 2,
                        }}
                      >
                        {copiedUtr === (tx.razorpay_utr_id || tx.razorpay_payment_id) ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "#475569", fontFamily: "monospace", marginTop: 2 }}>
                      {tx.razorpay_order_id}
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "#10b981" }}>
                    ₹{tx.amount_inr}
                  </td>

                  {/* Date */}
                  <td style={{ padding: "1rem 1.25rem", color: "#64748b", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    {new Date(tx.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
