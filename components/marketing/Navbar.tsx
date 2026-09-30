"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
      } else {
        // Check dev auth cookie
        const match = document.cookie.match(/pcl_dev_auth=([^;]+)/);
        if (match) {
          try {
            const dev = JSON.parse(decodeURIComponent(match[1]));
            setUser(dev);
          } catch {}
        }
      }
    });

    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Courses", href: "/courses" },
    { label: "About", href: "#instructor" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: isScrolled
          ? "rgba(10, 15, 30, 0.95)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
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
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.125rem",
              color: "#f9fafb",
              letterSpacing: "-0.02em",
            }}
          >
            Pro<span style={{ color: "#1e6fff" }}>Career</span>Labs
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.9375rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#f9fafb")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#94a3b8")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link
                href={
                  user.role === "super_admin" ||
                  user.role === "admin" ||
                  user.email === "admin@procareerlabs.com"
                    ? "/admin"
                    : "/dashboard"
                }
                style={{
                  background:
                    user.role === "super_admin" ||
                    user.role === "admin" ||
                    user.email === "admin@procareerlabs.com"
                      ? "linear-gradient(135deg, #1e6fff, #f5a623)"
                      : "#1e6fff",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 9999,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                {user.role === "super_admin" ||
                user.role === "admin" ||
                user.email === "admin@procareerlabs.com"
                  ? "👑 Admin Console"
                  : "🎓 Dashboard"}
              </Link>
              <button
                onClick={async () => {
                  try {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  } catch {}
                  try {
                    await fetch("/api/auth/signout", { method: "POST" });
                  } catch {}
                  document.cookie = "pcl_dev_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                  window.location.href = "/login";
                }}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#94a3b8",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "0.5rem 0.875rem",
                  borderRadius: 9999,
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  color: "#94a3b8",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                className="hidden md:block"
              >
                Sign In
              </Link>
              <Link
                href="/courses"
                style={{
                  background: "#1e6fff",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  padding: "0.625rem 1.5rem",
                  borderRadius: 9999,
                  textDecoration: "none",
                  boxShadow: "0 0 20px rgba(30,111,255,0.3)",
                  transition: "all 0.2s",
                }}
              >
                Enroll Now
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#f9fafb",
              cursor: "pointer",
              padding: "0.25rem",
            }}
            className="md:hidden"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          style={{
            background: "#111827",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: 500,
                padding: "0.5rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            style={{
              color: "#f9fafb",
              textDecoration: "none",
              fontWeight: 500,
              padding: "0.5rem 0",
            }}
            onClick={() => setIsMobileOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/courses"
            style={{
              background: "#1e6fff",
              color: "#fff",
              fontWeight: 700,
              textAlign: "center",
              padding: "0.875rem",
              borderRadius: 9999,
              textDecoration: "none",
            }}
            onClick={() => setIsMobileOpen(false)}
          >
            Enroll Now
          </Link>
        </div>
      )}
    </nav>
  );
}
