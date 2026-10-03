"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  Sliders,
  RotateCcw,
  Shield,
  Zap,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {}
    document.cookie = "pcl_dev_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Analytics Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Homepage and Cohort", href: "/admin/cohort", icon: <Calendar size={18} />, highlight: true },
    { name: "Course Management", href: "/admin/courses", icon: <BookOpen size={18} /> },
    { name: "Students & UTRs", href: "/admin/students", icon: <Users size={18} /> },
    { name: "Site & Ticker Settings", href: "/admin/site-settings", icon: <Sliders size={18} /> },
    { name: "Refunds & Invoices", href: "/admin/refunds", icon: <RotateCcw size={18} /> },
    { name: "Admin Roles", href: "/admin/admins", icon: <Shield size={18} /> },
  ];

  return (
    <aside
      style={{
        width: 260,
        background: "#0d1526",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        position: "sticky",
        top: 0,
      }}
    >
      <div>
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            padding: "0 0.75rem 1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #1e6fff, #f5a623)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.0625rem", color: "#f9fafb", letterSpacing: "-0.02em" }}>
              Pro<span style={{ color: "#1e6fff" }}>Career</span>Labs
            </div>
            <div style={{ fontSize: "0.6875rem", color: "#f5a623", fontWeight: 700, letterSpacing: "0.08em" }}>
              ADMIN CONSOLE
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 0.875rem",
                  borderRadius: 10,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: isActive ? "#f9fafb" : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(30, 111, 255, 0.25), rgba(30, 111, 255, 0.1))"
                    : "transparent",
                  border: isActive ? "1px solid rgba(30, 111, 255, 0.4)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <span style={{ color: isActive ? "#1e6fff" : "#64748b" }}>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span
                    style={{
                      fontSize: "0.625rem",
                      background: "rgba(245, 166, 35, 0.2)",
                      color: "#f5a623",
                      fontWeight: 800,
                      padding: "0.15rem 0.4rem",
                      borderRadius: 4,
                    }}
                  >
                    LIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Shortcuts */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "1rem" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 0.875rem",
            color: "#94a3b8",
            fontSize: "0.8125rem",
            textDecoration: "none",
            borderRadius: 8,
            marginBottom: "0.5rem",
          }}
        >
          <span>View Public Site</span>
          <ExternalLink size={14} />
        </Link>
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 0.875rem",
            color: "#94a3b8",
            fontSize: "0.8125rem",
            textDecoration: "none",
            borderRadius: 8,
            marginBottom: "0.5rem",
          }}
        >
          <span>Student Portal View</span>
          <ExternalLink size={14} />
        </Link>

        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 0.875rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#fca5a5",
            borderRadius: 8,
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
