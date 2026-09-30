"use client";
import { useState } from "react";
import { ArrowRight, Loader2, Zap } from "lucide-react";
import { initiateCourseCheckout } from "@/lib/checkout";

interface EnrollButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
}

export default function EnrollButton({ courseId, courseTitle, price }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleStartCheckout = () => {
    setShowModal(true);
  };

  const handleProceedToRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await initiateCourseCheckout({
        courseId,
        courseTitle,
        additionalStudentData: {
          phone,
          address,
          city,
        },
        onError: (err) => {
          setLoading(false);
          alert(`Checkout error: ${err.message || "Failed to launch payment"}`);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Something went wrong launching payment");
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
            <Loader2 size={18} className="animate-spin" /> Processing Order...
          </>
        ) : (
          <>
            <Zap size={18} fill="#fff" /> Enroll Now — ₹{price} <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Quick Details Confirmation Modal prior to Razorpay gateway */}
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
          >
            <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 0.5rem" }}>
              Confirm Student Information
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
              These details will be attached to your unique ProCareerLabs Student ID and verified Razorpay bank UTR receipt.
            </p>

            <form onSubmit={handleProceedToRazorpay} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  WhatsApp / Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="input-field"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                  Billing Address (Optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Green Valley Apartments"
                  className="input-field"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                    City / State
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="input-field"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 10,
                      padding: "0.75rem 1rem",
                      color: "#fff",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                    padding: "0.875rem",
                    borderRadius: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    background: "#1e6fff",
                    border: "none",
                    color: "#fff",
                    padding: "0.875rem",
                    borderRadius: 10,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Pay ₹" + price + " on Razorpay →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
