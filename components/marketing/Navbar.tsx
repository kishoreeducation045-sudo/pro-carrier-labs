"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/utils";
import MarqueeTicker from "./MarqueeTicker";

interface NavbarProps {
  tickerItems?: string[];
}

export default function Navbar({ tickerItems }: NavbarProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        let fullUser: any = { ...data.user };
        try {
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();
          if (profile?.role) {
            fullUser.role = profile.role;
          }
        } catch {}
        setUser(fullUser);
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
    { label: "Workshops", href: "/workshops" },
    { label: "About", href: "#instructor" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  const isAdmin =
    user &&
    (user.role === "super_admin" ||
      user.role === "admin" ||
      user.role === "course_admin" ||
      user.role === "content_manager" ||
      user.app_metadata?.role === "super_admin" ||
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "super_admin" ||
      user.user_metadata?.role === "admin" ||
      isAdminEmail(user.email));

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {}
    document.cookie = "pcl_dev_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/";
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
      }}
    >
      {/* 1. Marquee Ticker at the top (if items provided) */}
      {tickerItems && tickerItems.length > 0 && (
        <MarqueeTicker items={tickerItems} />
      )}

      {/* 2. Navigation Bar right below ticker */}
      <nav
        style={{
          transition: "background 0.3s ease, border-color 0.3s ease",
          background: isScrolled
            ? "rgba(10, 15, 30, 0.95)"
            : "rgba(10, 15, 30, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: isScrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.25rem",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="navbar-inner"
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg, #1e6fff, #f5a623)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.0625rem",
                color: "#f9fafb",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              Pro<span style={{ color: "#1e6fff" }}>Career</span>Labs
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.75rem",
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

          {/* Right Action Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    style={{
                      background: "linear-gradient(135deg, #1e6fff, #f5a623)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      padding: "0.45rem 1rem",
                      borderRadius: 9999,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >
                    👑 Admin Console
                  </Link>
                ) : (
                  <Link
                    href="/workshops"
                    style={{
                      background: "#1e6fff",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      padding: "0.45rem 1rem",
                      borderRadius: 9999,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >
                    Enroll Now
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.45rem 0.75rem",
                    borderRadius: 9999,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  className="hidden sm:inline-block"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href="/login?next=/"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#f9fafb",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    padding: "0.45rem 0.875rem",
                    borderRadius: 9999,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  className="hidden sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  href="/workshops"
                  style={{
                    background: "#1e6fff",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    padding: "0.45rem 1.125rem",
                    borderRadius: 9999,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    boxShadow: "0 0 16px rgba(30,111,255,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  Enroll Now
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f9fafb",
                cursor: "pointer",
                padding: "0.45rem",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileOpen && (
          <div
            style={{
              background: "rgba(13, 21, 38, 0.98)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "0.5rem" }}>
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      style={{
                        background: "linear-gradient(135deg, #1e6fff, #f5a623)",
                        color: "#fff",
                        fontWeight: 700,
                        textAlign: "center",
                        padding: "0.75rem",
                        borderRadius: 12,
                        textDecoration: "none",
                        fontSize: "0.9375rem",
                      }}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      👑 Admin Console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleSignOut();
                    }}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#94a3b8",
                      fontWeight: 600,
                      padding: "0.65rem",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login?next=/"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#f9fafb",
                    fontWeight: 600,
                    textAlign: "center",
                    padding: "0.75rem",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: "0.9375rem",
                  }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Login to Account
                </Link>
              )}

              <Link
                href="/workshops"
                style={{
                  background: "#1e6fff",
                  color: "#fff",
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "0.8rem",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                  boxShadow: "0 4px 14px rgba(30,111,255,0.35)",
                }}
                onClick={() => setIsMobileOpen(false)}
              >
                Enroll Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
