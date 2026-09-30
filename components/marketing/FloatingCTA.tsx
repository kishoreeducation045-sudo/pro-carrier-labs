"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

interface FloatingCTAProps {
  cohort?: {
    price_inr: number;
    seats_taken: number;
    max_seats: number;
  } | null;
}

export default function FloatingCTA({ cohort }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const price = cohort?.price_inr ?? 299;
  const seatsLeft = cohort ? cohort.max_seats - cohort.seats_taken : 52;

  useEffect(() => {
    const onScroll = () => {
      if (!isDismissed && window.scrollY > 600) {
        setIsVisible(true);
      } else if (window.scrollY <= 600) {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,15,30,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(30,111,255,0.2)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        animation: "fade-up 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
        <div>
          <p style={{ color: "#f9fafb", fontWeight: 700, margin: 0, fontSize: "0.9375rem" }}>
            Only{" "}
            <span style={{ color: "#f5a623" }}>{seatsLeft} seats left</span> at{" "}
            <span style={{ color: "#1e6fff" }}>₹{price}</span>
          </p>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.8125rem" }}>
            Price increases after seats fill
          </p>
        </div>
      </div>

      <Link
        href="/#cohort"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "#f5a623",
          color: "#0a0f1e",
          fontWeight: 800,
          fontSize: "0.9375rem",
          padding: "0.75rem 1.5rem",
          borderRadius: 9999,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          boxShadow: "0 0 24px rgba(245,166,35,0.35)",
        }}
      >
        Enroll Now <ArrowRight size={16} />
      </Link>

      <button
        onClick={() => setIsDismissed(true)}
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          padding: "0.25rem",
          flexShrink: 0,
        }}
      >
        <X size={20} />
      </button>
    </div>
  );
}
