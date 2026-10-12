"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Zap, Shield, MessageSquare, X } from "lucide-react";
import { initiateCourseCheckout } from "@/lib/checkout";

interface WorkshopEnrollButtonProps {
  workshopId: string;
  workshopTitle: string;
  price: number;
}

export default function WorkshopEnrollButton({
  workshopId,
  workshopTitle,
  price,
}: WorkshopEnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Registration Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleStartCheckout = () => {
    setShowModal(true);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await initiateCourseCheckout({
        courseId: workshopId,
        courseTitle: workshopTitle,
        additionalStudentData: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          city: city.trim(),
        },
        onError: (err) => {
          setLoading(false);
          alert(`Checkout error: ${err.message || "Failed to launch payment"}`);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (err: unknown) {
      setLoading(false);
      alert(err instanceof Error ? err.message : "Something went wrong launching payment");
    }
  };

  return (
    <>
      <button
        onClick={handleStartCheckout}
        disabled={loading}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #1e6fff, #1658d4)",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "1.0625rem",
          padding: "1.125rem",
          borderRadius: 14,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.625rem",
          boxShadow: "0 0 30px rgba(30, 111, 255, 0.4)",
          transition: "all 0.2s",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Preparing Workshop Seat...
          </>
        ) : (
          <>
            <Zap size={18} fill="#fff" /> Enroll in Workshop — ₹{price} <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Student Registration Modal */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              maxWidth: 480,
              width: "100%",
              padding: "2rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <span
                  style={{
                    background: "rgba(30,111,255,0.15)",
                    color: "#60a5fa",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: 9999,
                    display: "inline-block",
                    marginBottom: "0.375rem",
                  }}
                >
                  Direct Registration
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f9fafb", margin: 0 }}>
                  Enter Your Details to Join
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
              Your details are used to issue your verified <strong>Student ID</strong>, grant <strong>WhatsApp Cohort Access</strong>, and send the live session link.
            </p>

            <form onSubmit={handleProceedToPayment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  Email Address * (For Calendar & Zoom Invite)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  WhatsApp / Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru / Mumbai / Delhi"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#10b981",
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                }}
              >
                <MessageSquare size={14} />
                Instant private WhatsApp community link provided right after enrollment!
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.5rem",
                  width: "100%",
                  background: "linear-gradient(135deg, #1e6fff, #1658d4)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "1rem",
                  padding: "0.875rem",
                  borderRadius: 12,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 16px rgba(30, 111, 255, 0.4)",
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="#fff" />}
                {loading ? "Processing..." : `Proceed to Pay ₹${price}`}
              </button>

              <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.75rem", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                <Shield size={12} /> 100% Secure Checkout via Razorpay · UPI, Cards, Netbanking
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
