"use client";
import Link from "next/link";
import { Zap, Mail, Phone, Globe, MessageSquare, Share2 } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: "All Courses", href: "/courses" },
      { label: "AI Masterclass", href: "/courses/ai-masterclass" },
      { label: "LinkedIn Growth", href: "/courses/linkedin-growth" },
      { label: "CA Intermediate", href: "/courses/ca-intermediate" },
      { label: "Resume Coaching", href: "/courses/resume-career-coaching" },
    ],
    Account: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/signup" },
      { label: "My Dashboard", href: "/dashboard" },
      { label: "My Courses", href: "/my-courses" },
      { label: "My Certificates", href: "/certificates" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Refund Policy", href: "#refund-policy" },
      { label: "Contact Us", href: "mailto:neeraj.4all.kr@gmail.com" },
    ],
  };

  return (
    <footer
      style={{
        background: "#050c1a",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "4rem 1.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #1e6fff, #f5a623)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={20} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#f9fafb", letterSpacing: "-0.02em" }}>
                Pro<span style={{ color: "#1e6fff" }}>Career</span>Labs
              </span>
            </Link>
            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 280 }}>
              AI-powered education platform helping Indian professionals earn more, grow faster, and build careers that matter.
            </p>

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <a
                href="mailto:neeraj.4all.kr@gmail.com"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1e6fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
              >
                <Mail size={14} color="#1e6fff" /> neeraj.4all.kr@gmail.com
              </a>
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { label: "LinkedIn", icon: <Globe size={16} />, href: "https://www.linkedin.com" },
                { label: "Community", icon: <MessageSquare size={16} />, href: "https://chat.whatsapp.com" },
                {
                  label: "Share",
                  icon: <Share2 size={16} />,
                  href: "#share",
                  onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator.share({
                        title: "ProCareerLabs | AI-Powered Learning",
                        text: "Transform your career with high-income AI & LinkedIn skills at ProCareerLabs!",
                        url: window.location.origin,
                      }).catch(() => {});
                    } else if (typeof window !== "undefined") {
                      navigator.clipboard?.writeText(window.location.origin);
                      alert("Link copied to clipboard!");
                    }
                  },
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  onClick={social.onClick}
                  title={social.label}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,111,255,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "#1e6fff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(30,111,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#64748b";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4
                style={{
                  color: "#f9fafb",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                  letterSpacing: "0.03em",
                }}
              >
                {title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#94a3b8")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#64748b")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginBottom: "1.5rem" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "#475569", fontSize: "0.8125rem", margin: 0 }}>
            © {year} ProCareerLabs. All rights reserved.
          </p>
          <p style={{ color: "#475569", fontSize: "0.8125rem", margin: 0 }}>
            Made with ❤️ for Indian professionals
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
