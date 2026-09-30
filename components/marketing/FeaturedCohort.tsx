"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { getCountdown } from "@/lib/utils";

interface FeaturedCohortProps {
  cohort: {
    title: string;
    cohort_date: string;
    duration_hours: number;
    max_seats: number;
    seats_taken: number;
    price_inr: number;
    original_price_inr: number;
    zoom_link?: string;
  } | null;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
        minWidth: 72,
      }}
    >
      <div
        style={{
          background: "rgba(30,111,255,0.12)",
          border: "1px solid rgba(30,111,255,0.25)",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          fontWeight: 800,
          fontSize: "2rem",
          color: "#f9fafb",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          minWidth: 72,
          textAlign: "center",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span style={{ color: "#64748b", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

const DEFAULT_COHORT_DATE = "2026-11-15T19:00:00.000Z";

export default function FeaturedCohort({ cohort }: FeaturedCohortProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  const targetDate = cohort?.cohort_date || DEFAULT_COHORT_DATE;

  useEffect(() => {
    function update() {
      setCountdown(getCountdown(targetDate));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const seatsLeft = cohort ? cohort.max_seats - cohort.seats_taken : 52;
  const seatsPercent = cohort ? (cohort.seats_taken / cohort.max_seats) * 100 : 48;
  const price = cohort?.price_inr ?? 299;
  const originalPrice = cohort?.original_price_inr ?? 2999;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <section
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1526 50%, #0a0f1e 100%)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Section label */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(245,166,35,0.1)",
              border: "1px solid rgba(245,166,35,0.3)",
              color: "#f5a623",
              fontSize: "0.8125rem",
              fontWeight: 700,
              padding: "0.375rem 1rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            🔥 Featured Live Cohort
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#f9fafb",
              margin: "1rem 0 0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            {cohort?.title ?? "AI Masterclass with Neeraj Kumar"}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", margin: 0 }}>
            Reserve your seat before it sells out
          </p>
        </div>

        {/* Main cohort card */}
        <div
          style={{
            background: "rgba(17,24,39,0.9)",
            border: "1px solid rgba(30,111,255,0.2)",
            borderRadius: 24,
            padding: "2.5rem",
            boxShadow: "0 0 60px rgba(30,111,255,0.1), 0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Countdown */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ color: "#64748b", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {countdown.expired ? "Cohort has started" : "Cohort starts in"}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <CountdownBox value={countdown.days} label="Days" />
              <div style={{ color: "#1e6fff", fontSize: "2rem", fontWeight: 800, alignSelf: "flex-start", paddingTop: "0.75rem" }}>:</div>
              <CountdownBox value={countdown.hours} label="Hours" />
              <div style={{ color: "#1e6fff", fontSize: "2rem", fontWeight: 800, alignSelf: "flex-start", paddingTop: "0.75rem" }}>:</div>
              <CountdownBox value={countdown.minutes} label="Mins" />
              <div style={{ color: "#1e6fff", fontSize: "2rem", fontWeight: 800, alignSelf: "flex-start", paddingTop: "0.75rem" }}>:</div>
              <CountdownBox value={countdown.seconds} label="Secs" />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

          {/* Pricing & Seats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {/* Price */}
            <div>
              <p style={{ color: "#64748b", fontSize: "0.8125rem", fontWeight: 600, margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Investment</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#f9fafb" }}>₹{price}</span>
                <span style={{ fontSize: "1rem", color: "#64748b", textDecoration: "line-through" }}>₹{originalPrice}</span>
                <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 9999 }}>
                  {discount}% OFF
                </span>
              </div>
            </div>

            {/* Seats */}
            <div>
              <p style={{ color: "#64748b", fontSize: "0.8125rem", fontWeight: 600, margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Seats Left: <span style={{ color: seatsLeft < 20 ? "#ef4444" : "#f5a623" }}>{seatsLeft}</span>
              </p>
              <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 9999, overflow: "hidden", marginTop: "0.5rem" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${seatsPercent}%`,
                    background: "linear-gradient(90deg, #1e6fff, #f5a623)",
                    borderRadius: 9999,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.375rem" }}>
                {Math.round(seatsPercent)}% seats taken
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/courses"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              background: "linear-gradient(135deg, #1e6fff, #1658d4)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.125rem",
              padding: "1.125rem",
              borderRadius: 14,
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(30,111,255,0.4)",
              transition: "all 0.2s",
              marginBottom: "1rem",
            }}
          >
            Reserve My Seat — ₹{price} Only
            <ArrowRight size={20} />
          </Link>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.8125rem", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
            <Shield size={14} />
            Secure checkout · UPI, Cards, Netbanking accepted
          </p>
        </div>
      </div>
    </section>
  );
}
