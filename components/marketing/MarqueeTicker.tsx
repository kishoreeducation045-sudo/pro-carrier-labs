"use client";
import { useEffect, useRef } from "react";

interface MarqueeTickerProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "🎁 5 free bonuses worth ₹23,500+",
  "👥 12,000+ professionals trained across India",
  "⭐ 4.9 / 5 from 15k+ reviews",
  "🔥 Seats almost full!",
  "⏰ Limited time pricing — enroll before it's gone",
  "🏆 ₹2.4 Cr+ client revenue unlocked using AI",
  "📈 8x avg LinkedIn profile-view growth in 30 days",
];

export default function MarqueeTicker({ items = DEFAULT_ITEMS }: MarqueeTickerProps) {
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #1e6fff, #1658d4)",
        overflow: "hidden",
        padding: "0.45rem 0",
        position: "relative",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
      className="marquee-container"
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "marquee 35s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#ffffff",
              padding: "0 1.75rem",
              gap: "0.5rem",
            }}
            className="marquee-item"
          >
            {item}
            <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: "1.25rem" }}>•</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .marquee-container {
            padding: 0.35rem 0 !important;
          }
          .marquee-item {
            font-size: 0.75rem !important;
            padding: 0 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
