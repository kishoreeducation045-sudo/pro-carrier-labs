"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Calendar, Clock, Users } from "lucide-react";
import { formatGoogleDriveUrl } from "@/lib/utils";

interface HeroContent {
  headline?: string;
  subheadline?: string;
  badgeText?: string;
  ctaText?: string;
  ratingValue?: string;
  ratingLabel?: string;
  studentsCount?: string;
  studentsLabel?: string;
  imageUrl?: string;
}

interface HeroSectionProps {
  cohort?: {
    cohort_date: string;
    duration_hours: number;
    max_seats: number;
    seats_taken: number;
    price_inr: number;
    original_price_inr: number;
  } | null;
  heroContent?: HeroContent | null;
}

export default function HeroSection({ cohort, heroContent }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Dynamic values with fallbacks ──
  const cohortDate = cohort
    ? new Date(cohort.cohort_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
      })
    : "15th November";

  const cohortTime = cohort
    ? new Date(cohort.cohort_date).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "7:00 PM";

  const seatsLeft = cohort ? cohort.max_seats - cohort.seats_taken : 48;
  const price = cohort?.price_inr ?? 299;
  const originalPrice = cohort?.original_price_inr ?? 2999;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  // Hero copy — admin-set with sensible defaults
  const badgeText = heroContent?.badgeText || `Live Cohort • ${cohortDate}`;
  const ctaText = heroContent?.ctaText || "YES! Reserve My Spot";
  const ratingValue = heroContent?.ratingValue || "4.9";
  const ratingLabel = heroContent?.ratingLabel || "Avg Rating";
  const studentsCount = heroContent?.studentsCount || "12K+";
  const studentsLabel = heroContent?.studentsLabel || "Professionals Trained";

  // Determine hero image
  const rawImageUrl = heroContent?.imageUrl;
  const heroImageSrc = rawImageUrl ? formatGoogleDriveUrl(rawImageUrl) : null;
  const isGoogleDriveImage = rawImageUrl
    ? rawImageUrl.includes("drive.google.com") || rawImageUrl.includes("lh3.googleusercontent.com")
    : false;

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 120,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(30,111,255,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-5%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          width: "100%",
        }}
        className="hero-grid"
      >
        {/* Left: Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Badge */}
          <div className="reveal" style={{ transitionDelay: "0ms" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(30,111,255,0.12)",
                border: "1px solid rgba(30,111,255,0.3)",
                color: "#60a5fa",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.375rem 1rem",
                borderRadius: 9999,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#1e6fff",
                  boxShadow: "0 0 8px #1e6fff",
                  animation: "pulse-glow 2s infinite",
                  display: "inline-block",
                }}
              />
              {badgeText}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="reveal"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#f9fafb",
              margin: 0,
              transitionDelay: "120ms",
            }}
          >
            {heroContent?.headline ? (
              heroContent.headline
            ) : (
              <>
                How Working Professionals Are Using{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #1e6fff, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  AI to Earn
                </span>{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #fbbf24)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹50K–₹1L Extra
                </span>{" "}
                Every Month
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p
            className="reveal"
            style={{
              fontSize: "1.125rem",
              color: "#94a3b8",
              margin: 0,
              transitionDelay: "240ms",
              lineHeight: 1.7,
            }}
          >
            {heroContent?.subheadline || "Without quitting their job or knowing how to code."}
          </p>

          {/* Session info card */}
          <div
            className="reveal"
            style={{
              background: "rgba(17,24,39,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "1.25rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              transitionDelay: "360ms",
            }}
          >
            {[
              { icon: <Calendar size={16} />, label: "Date", value: cohortDate },
              { icon: <Clock size={16} />, label: "Time", value: cohortTime },
              { icon: <Users size={16} />, label: "Seats Left", value: `${seatsLeft} only` },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#1e6fff",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.icon}
                </div>
                <p style={{ color: "#64748b", fontSize: "0.75rem", margin: 0, marginBottom: 2 }}>
                  {item.label}
                </p>
                <p style={{ color: "#f9fafb", fontWeight: 700, fontSize: "0.9375rem", margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className="reveal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              transitionDelay: "480ms",
            }}
          >
            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#f5a623",
                color: "#0a0f1e",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "1rem 2rem",
                borderRadius: 9999,
                textDecoration: "none",
                boxShadow: "0 0 30px rgba(245,166,35,0.35)",
                transition: "all 0.2s",
              }}
            >
              {ctaText} — ₹{price}
              <ArrowRight size={18} />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "#64748b", textDecoration: "line-through" }}>
                ₹{originalPrice}
              </span>
              <span
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#10b981",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.625rem",
                  borderRadius: 9999,
                }}
              >
                {discount}% OFF
              </span>
            </div>
          </div>

          {/* Trust signals */}
          <p
            className="reveal"
            style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0, transitionDelay: "600ms" }}
          >
            🔒 Secure checkout · UPI, Cards, Netbanking
          </p>
        </div>

        {/* Right: Instructor / Hero image */}
        <div
          className="reveal"
          style={{ position: "relative", transitionDelay: "200ms" }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 60px rgba(30,111,255,0.15)",
            }}
          >
            {heroImageSrc && isGoogleDriveImage ? (
              // Use regular <img> for Google Drive (avoids next/image domain config complexity)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImageSrc}
                alt="Pro Career Labs Hero"
                style={{ width: "100%", height: "auto", display: "block", maxHeight: 700, objectFit: "cover" }}
              />
            ) : heroImageSrc ? (
              <Image
                src={heroImageSrc}
                alt="Pro Career Labs Hero"
                width={600}
                height={700}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            ) : (
              <Image
                src="/neeraj-linkedin.jpg"
                alt="Neeraj Kumar - LinkedIn Influencer & AI Trainer"
                width={600}
                height={700}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            )}
            {/* Overlay gradient at bottom */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                background: "linear-gradient(transparent, #0a0f1e)",
              }}
            />
          </div>

          {/* Floating students badge */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: -24,
              background: "rgba(17,24,39,0.95)",
              border: "1px solid rgba(245,166,35,0.3)",
              borderRadius: 14,
              padding: "1rem 1.25rem",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <p style={{ color: "#f5a623", fontWeight: 800, fontSize: "1.5rem", margin: 0 }}>
              {studentsCount}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>{studentsLabel}</p>
          </div>

          {/* Floating rating badge */}
          <div
            style={{
              position: "absolute",
              top: 24,
              right: -16,
              background: "rgba(17,24,39,0.95)",
              border: "1px solid rgba(30,111,255,0.3)",
              borderRadius: 14,
              padding: "0.875rem 1.25rem",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <p style={{ color: "#fbbf24", fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>
              ⭐ {ratingValue}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>{ratingLabel}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
