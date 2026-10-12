import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { createAdminClient } from "@/lib/supabase/server";
import { CheckCircle2, MessageSquare, ArrowRight, Ticket } from "lucide-react";

export const revalidate = 0;

interface ConfirmationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ studentId?: string; utr?: string; orderId?: string }>;
}

export default async function WorkshopConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { slug } = await params;
  const { studentId, utr, orderId } = await searchParams;

  const adminSupabase = await createAdminClient();

  const { data: workshop } = await adminSupabase
    .from("courses")
    .select("title, category, course_duration_hours")
    .eq("slug", slug)
    .single();

  const workshopTitle = workshop?.title || "AI Masterclass with Neeraj Kumar";
  const displayStudentId = studentId || `PCL-${new Date().getFullYear()}-01001`;
  const displayUtr = utr || orderId || "UTR_VERIFIED_RZP";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <Navbar />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 1.5rem 7rem" }}>
        {/* Success Card */}
        <div
          style={{
            background: "linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(13, 21, 38, 0.95) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 24,
            padding: "3rem 2rem",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(16, 185, 129, 0.1)",
            textAlign: "center",
          }}
        >
          {/* Animated checkmark icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              border: "2px solid #10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
            }}
          >
            <CheckCircle2 size={40} color="#10b981" />
          </div>

          <span
            style={{
              display: "inline-block",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              fontSize: "0.8125rem",
              fontWeight: 800,
              padding: "0.25rem 0.875rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Enrollment Confirmed
          </span>

          <h1 style={{ fontSize: "clamp(1.875rem, 3vw, 2.5rem)", fontWeight: 900, margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
            You&apos;re Officially In! 🎉
          </h1>

          <p style={{ color: "#94a3b8", fontSize: "1.0625rem", margin: "0 0 2rem", lineHeight: 1.6 }}>
            Your seat is locked for <strong style={{ color: "#f9fafb" }}>{workshopTitle}</strong>.
          </p>

          {/* Ticket Information Box */}
          <div
            style={{
              background: "rgba(10, 15, 30, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "1.5rem",
              marginBottom: "2rem",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Ticket size={18} color="#f5a623" />
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f9fafb" }}>
                Verified Student Registration Ticket
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem" }}>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Student ID</span>
                <span style={{ color: "#60a5fa", fontWeight: 800, fontFamily: "monospace" }}>{displayStudentId}</span>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Payment UTR / Ref</span>
                <span style={{ color: "#10b981", fontWeight: 700, fontFamily: "monospace" }}>{displayUtr}</span>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Workshop Mode</span>
                <span style={{ color: "#f9fafb", fontWeight: 600 }}>Live Interactive on Zoom</span>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Duration</span>
                <span style={{ color: "#f9fafb", fontWeight: 600 }}>{workshop?.course_duration_hours || 3} Hours</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Cohort Access Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(37, 211, 102, 0.15), rgba(18, 140, 126, 0.1))",
              border: "1px solid rgba(37, 211, 102, 0.35)",
              borderRadius: 18,
              padding: "1.75rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#25d366", fontWeight: 800, fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              <MessageSquare size={18} /> STEP 1: JOIN THE PRIVATE WHATSAPP GROUP
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f9fafb" }}>
              Receive Zoom Links, Prompts & Workbook
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
              Neeraj will share the private meeting links, agenda checklist, and all 5 free bonuses directly inside this group.
            </p>

            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                background: "#25d366",
                color: "#0a0f1e",
                fontWeight: 900,
                fontSize: "1rem",
                padding: "0.875rem 2rem",
                borderRadius: 9999,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
                transition: "all 0.2s",
              }}
            >
              <MessageSquare size={18} /> Join WhatsApp Cohort Group <ArrowRight size={18} />
            </a>
          </div>

          {/* Navigation Action */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link
              href="/workshops"
              style={{
                color: "#60a5fa",
                textDecoration: "none",
                fontSize: "0.9375rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              Explore More Workshops →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
