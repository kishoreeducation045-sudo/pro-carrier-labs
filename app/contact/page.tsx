import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { createAdminClient } from "@/lib/supabase/server";
import { Mail, Clock, ShieldCheck, ExternalLink, MessageSquare, ArrowLeft } from "lucide-react";

export const revalidate = 60;

const GOOGLE_FORM_SHORT_URL = "https://forms.gle/iXiYqRW5zDjSajzK9";
const GOOGLE_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdqMh8bpdmCHraQbo1hkdNFNzgcAqitlDsCfPsqQIbEGXtMVQ/viewform?embedded=true";

export default async function ContactPage() {
  const adminSupabase = await createAdminClient();

  const { data: settings } = await adminSupabase
    .from("site_settings")
    .select("key, value");

  const settingsMap = Object.fromEntries(
    (settings ?? []).map((s: { key: string; value: string }) => [s.key, s.value])
  );

  let tickerItems: string[] | undefined;
  try {
    tickerItems = settingsMap.ticker_items ? JSON.parse(settingsMap.ticker_items) : undefined;
  } catch {
    tickerItems = undefined;
  }

  const formUrl = settingsMap.contact_form_url || GOOGLE_FORM_SHORT_URL;
  const embedUrl = settingsMap.contact_form_embed_url || GOOGLE_FORM_EMBED_URL;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#f9fafb" }}>
      <Navbar tickerItems={tickerItems} />

      <main
        className="contact-page-container"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "8.5rem 1.5rem 6rem",
        }}
      >
        {/* Back Link */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 750, margin: "0 auto 3.5rem" }}>
          <span
            style={{
              background: "rgba(30, 111, 255, 0.12)",
              border: "1px solid rgba(30, 111, 255, 0.3)",
              color: "#60a5fa",
              fontSize: "0.8125rem",
              fontWeight: 800,
              padding: "0.375rem 1rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "1rem",
            }}
          >
            CONTACT & SUPPORT
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 900,
              margin: "0 0 1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Get in Touch with <span style={{ color: "#1e6fff" }}>ProCareerLabs</span>
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Have a question about our live masterclasses, corporate workshops, or technical support? Fill in the Google Form below and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Quick Info Grid */}
        <div
          className="contact-info-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(30, 111, 255, 0.12)",
                border: "1px solid rgba(30, 111, 255, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e6fff",
                flexShrink: 0,
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "0.9375rem", fontWeight: 700, color: "#f9fafb" }}>
                Direct Email
              </h3>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.8125rem", color: "#64748b" }}>
                For enterprise, partnerships & urgent queries
              </p>
              <a
                href="mailto:neeraj.4all.kr@gmail.com"
                style={{ color: "#60a5fa", fontSize: "0.875rem", textDecoration: "none", fontWeight: 600 }}
              >
                neeraj.4all.kr@gmail.com
              </a>
            </div>
          </div>

          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(245, 166, 35, 0.12)",
                border: "1px solid rgba(245, 166, 35, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f5a623",
                flexShrink: 0,
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "0.9375rem", fontWeight: 700, color: "#f9fafb" }}>
                Response Time
              </h3>
              <p style={{ margin: "0 0 0.25rem", fontSize: "0.8125rem", color: "#64748b" }}>
                Active support hours: 9:00 AM – 8:00 PM IST
              </p>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#f5a623" }}>
                Replies within 24 hours
              </p>
            </div>
          </div>

          <div
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "0.9375rem", fontWeight: 700, color: "#f9fafb" }}>
                Enrollment Help
              </h3>
              <p style={{ margin: "0 0 0.25rem", fontSize: "0.8125rem", color: "#64748b" }}>
                Instant confirmation on workshop booking
              </p>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#10b981" }}>
                100% Guaranteed Support
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Google Form Card */}
        <div
          className="contact-form-card"
          style={{
            background: "rgba(17, 24, 39, 0.9)",
            border: "1px solid rgba(30, 111, 255, 0.2)",
            borderRadius: 24,
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.25rem", color: "#f9fafb" }}>
                Official Contact Form
              </h2>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
                Fill out the fields below or open directly in Google Forms
              </p>
            </div>

            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-form-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(30, 111, 255, 0.15)",
                border: "1px solid rgba(30, 111, 255, 0.3)",
                color: "#60a5fa",
                padding: "0.6rem 1.15rem",
                borderRadius: 10,
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Open Form in New Tab <ExternalLink size={15} />
            </a>
          </div>

          {/* Iframe wrapper */}
          <div
            className="iframe-wrapper"
            style={{
              position: "relative",
              width: "100%",
              minHeight: 700,
              borderRadius: 16,
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="780"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="ProCareerLabs Contact Form"
              style={{
                display: "block",
                width: "100%",
                height: 780,
                border: "none",
              }}
            >
              Loading contact form…
            </iframe>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .contact-page-container {
            padding-top: 6.5rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .contact-form-card {
            padding: 1.25rem 0.85rem !important;
            border-radius: 18px !important;
          }
          .open-form-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}

