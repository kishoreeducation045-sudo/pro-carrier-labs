"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, BookOpen, LayoutDashboard, Award, LogOut, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StudentNavbarProps {
  studentName?: string;
  studentId?: string;
  role?: string;
}

export default function StudentNavbar({
  studentName = "Student",
  studentId = "PCL-MEMBER",
  role = "student",
}: StudentNavbarProps) {
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

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Courses", href: "/my-courses", icon: <BookOpen size={18} /> },
    { name: "Course Catalog", href: "/courses", icon: <Zap size={18} /> },
    { name: "Certificates", href: "/certificates", icon: <Award size={18} /> },
  ];

  const isAdmin = ["admin", "super_admin", "course_admin"].includes(role);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10, 15, 30, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "0.75rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
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
            <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#f9fafb", letterSpacing: "-0.02em" }}>
              Pro<span style={{ color: "#1e6fff" }}>Career</span>Labs
            </span>
          </Link>

          {/* Nav items desktop */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="student-nav-links">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.875rem",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    color: active ? "#f9fafb" : "#94a3b8",
                    background: active ? "rgba(30, 111, 255, 0.15)" : "transparent",
                    border: active ? "1px solid rgba(30, 111, 255, 0.3)" : "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isAdmin && (
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "rgba(245, 166, 35, 0.15)",
                border: "1px solid rgba(245, 166, 35, 0.4)",
                color: "#f5a623",
                fontSize: "0.8125rem",
                fontWeight: 700,
                padding: "0.375rem 0.75rem",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              <ShieldCheck size={15} />
              Admin Portal
            </Link>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "0.375rem 0.75rem",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1e6fff, #0a0f1e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f9fafb",
                fontSize: "0.8125rem",
                fontWeight: 700,
              }}
            >
              {studentName ? studentName.charAt(0).toUpperCase() : <User size={14} />}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#f9fafb" }}>
                {studentName}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#f5a623", fontFamily: "monospace" }}>
                {studentId}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              background: "none",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 8,
              padding: "0.45rem",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
