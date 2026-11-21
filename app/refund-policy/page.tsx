import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "Refund Policy | ProCareerLabs",
  description: "ProCareerLabs refund policy — 90% refund within 7 days if content not accessed.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "2.5rem" }}>
    <h2
      style={{
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#f9fafb",
        marginBottom: "1rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {title}
    </h2>
    <div style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          background: "#0a0f1e",
          minHeight: "100vh",
          padding: "7rem 1.5rem 5rem",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(30,111,255,0.12)",
                border: "1px solid rgba(30,111,255,0.3)",
                color: "#60a5fa",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.3rem 0.9rem",
                borderRadius: 999,
                marginBottom: "1rem",
              }}
            >
              Legal
            </span>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "#f9fafb",
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Refund Policy
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Last updated: November 2026 &nbsp;·&nbsp; Effective immediately
            </p>
          </div>

          {/* Highlight Banner */}
          <div
            style={{
              background: "rgba(245,166,35,0.08)",
              border: "1px solid rgba(245,166,35,0.25)",
              borderRadius: 12,
              padding: "1.25rem 1.5rem",
              marginBottom: "2.5rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>🛡️</span>
            <div>
              <p style={{ color: "#f5a623", fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>
                7-Day Money-Back Guarantee
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.7 }}>
                We stand behind the quality of our workshops. If you&apos;re not satisfied, you can
                request a <strong style={{ color: "#f9fafb" }}>90% refund</strong> within 7 days of
                purchase — no lengthy explanations required.
              </p>
            </div>
          </div>

          {/* Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "clamp(1.5rem, 4vw, 3rem)",
            }}
          >
            <Section title="1. Refund Eligibility">
              <p>You are eligible for a refund if <strong style={{ color: "#f9fafb" }}>all</strong> of the following conditions are met:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>
                  Your refund request is submitted within <strong style={{ color: "#f9fafb" }}>7 calendar days</strong> of the
                  original purchase date.
                </li>
                <li>
                  You have <strong style={{ color: "#f9fafb" }}>not attended</strong> any live workshop session, masterclass,
                  or any event offered under the purchased plan.
                </li>
                <li>
                  You have <strong style={{ color: "#f9fafb" }}>not accessed or downloaded</strong> any course materials,
                  recordings, templates, or bonus resources.
                </li>
              </ul>
            </Section>

            <Section title="2. Refund Amount">
              <p>
                Approved refunds will be for <strong style={{ color: "#f9fafb" }}>90% of the amount paid</strong>. The
                remaining 10% covers payment gateway processing fees and administrative costs that
                are non-recoverable.
              </p>
              <div
                style={{
                  background: "rgba(30,111,255,0.08)",
                  border: "1px solid rgba(30,111,255,0.2)",
                  borderRadius: 8,
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                <p style={{ color: "#60a5fa", fontSize: "0.875rem" }}>
                  <strong>Example:</strong> If you paid ₹999, you will receive ₹899.10 as a refund.
                </p>
              </div>
            </Section>

            <Section title="3. How to Request a Refund">
              <p>To initiate a refund, please:</p>
              <ol style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li>
                  Email us at{" "}
                  <a
                    href="mailto:neeraj.4all.kr@gmail.com"
                    style={{ color: "#60a5fa", textDecoration: "none" }}
                  >
                    neeraj.4all.kr@gmail.com
                  </a>{" "}
                  with the subject line: <strong style={{ color: "#f9fafb" }}>Refund Request — [Your Name]</strong>
                </li>
                <li>
                  Include the following in your email:
                  <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <li>Registered email address.</li>
                    <li>Order / payment ID (from your Razorpay receipt).</li>
                    <li>Name of the workshop or course purchased.</li>
                    <li>Date of purchase.</li>
                  </ul>
                </li>
                <li>
                  Our team will verify eligibility and respond within <strong style={{ color: "#f9fafb" }}>1–2 business days</strong>.
                </li>
              </ol>
            </Section>

            <Section title="4. Refund Processing Time">
              <p>
                Once your refund is approved, the amount will be credited to your original payment
                method within <strong style={{ color: "#f9fafb" }}>5–7 business days</strong>. Processing times may vary
                depending on your bank or payment provider.
              </p>
            </Section>

            <Section title="5. Non-Refundable Situations">
              <p>Refunds will <strong style={{ color: "#f9fafb" }}>not</strong> be issued in the following cases:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>The refund request is made after 7 days of purchase.</li>
                <li>You have attended one or more live sessions.</li>
                <li>You have accessed, downloaded, or viewed course materials or recordings.</li>
                <li>The purchase was made during a special promotional offer or at a discounted price (unless otherwise stated).</li>
                <li>Duplicate purchases — please contact us immediately if you are charged twice.</li>
              </ul>
            </Section>

            <Section title="6. Changes to This Policy">
              <p>
                ProCareerLabs reserves the right to modify this Refund Policy at any time. Changes
                will be effective upon posting to this page. The policy in effect at the time of
                your purchase will apply to your refund request.
              </p>
            </Section>

            <Section title="7. Contact Us">
              <p>
                For any refund queries or concerns, reach us at:
              </p>
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "1rem 1.25rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p style={{ color: "#f9fafb", fontWeight: 600, marginBottom: "0.25rem" }}>ProCareerLabs Support</p>
                <a
                  href="mailto:neeraj.4all.kr@gmail.com"
                  style={{ color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  neeraj.4all.kr@gmail.com
                </a>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  Bangalore, Karnataka, India
                </p>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
