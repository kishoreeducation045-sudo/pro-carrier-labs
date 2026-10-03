"use client";
import { useEffect, useRef, useState } from "react";
import { Trophy, Users, TrendingUp, Clock } from "lucide-react";

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stat1?: Partial<Stat>;
  stat2?: Partial<Stat>;
  stat3?: Partial<Stat>;
  stat4?: Partial<Stat>;
}

const DEFAULTS: Stat[] = [
  { value: "12K+", label: "Professionals Trained Across India" },
  { value: "150+", label: "Corporate AI Workshops Delivered" },
  { value: "4.9★", label: "Average Rating from Students" },
  { value: "10 hrs / wk", label: "Avg Time Saved After Class" },
];

const ICONS = [<Users size={22} />, <Trophy size={22} />, <TrendingUp size={22} />, <Clock size={22} />];

function AnimatedStat({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const numValue = parseFloat(value.replace(/[^0-9.]/g, ""));
          const suffix = value.replace(/[0-9.,\s]/g, "");
          if (isNaN(numValue)) {
            setDisplay(value);
            return;
          }
          let start = 0;
          const steps = 60;
          const increment = numValue / steps;
          const timer = setInterval(() => {
            start += increment;
            if (start >= numValue) {
              setDisplay(value);
              clearInterval(timer);
            } else {
              const formatted =
                numValue > 999
                  ? (start / 1000).toFixed(1) + "K"
                  : Math.floor(start).toString();
              setDisplay(formatted + (numValue > 999 ? "+" : suffix));
            }
          }, 25);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      style={{
        background: "rgba(17,24,39,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "2rem",
        textAlign: "center",
        transition: "all 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,111,255,0.3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: "rgba(30,111,255,0.12)",
          border: "1px solid rgba(30,111,255,0.2)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem",
          color: "#1e6fff",
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontSize: "2.25rem",
          fontWeight: 900,
          color: "#1e6fff",
          margin: "0 0 0.25rem",
          letterSpacing: "-0.02em",
        }}
      >
        {display}
      </p>
      <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>{label}</p>
    </div>
  );
}

export default function StatsSection({ stat1, stat2, stat3, stat4 }: StatsSectionProps) {
  const stats = [stat1, stat2, stat3, stat4].map((s, i) => ({
    value: s?.value || DEFAULTS[i].value,
    label: s?.label || DEFAULTS[i].label,
  }));

  return (
    <section style={{ padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {stats.map((stat, i) => (
            <AnimatedStat key={i} value={stat.value} label={stat.label} icon={ICONS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
