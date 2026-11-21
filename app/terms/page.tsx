import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "Terms of Service | ProCareerLabs",
  description: "Read the Terms of Service for using the ProCareerLabs platform.",
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

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Last updated: November 2026 &nbsp;·&nbsp; Effective immediately
            </p>
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
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using the ProCareerLabs platform (including our website, workshops,
                masterclasses, and digital content), you agree to be bound by these Terms of
                Service. If you do not agree, please do not use our platform.
              </p>
            </Section>

            <Section title="2. Description of Services">
              <p>ProCareerLabs provides:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Live online workshops and masterclasses on AI, LinkedIn, and career growth topics.</li>
                <li>Recorded session replays (where applicable).</li>
                <li>Digital resources, templates, and bonus materials.</li>
                <li>Community access via WhatsApp or other channels.</li>
              </ul>
            </Section>

            <Section title="3. User Accounts">
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must provide accurate information when registering.</li>
                <li>You may not share, sell, or transfer your account to another person.</li>
                <li>
                  ProCareerLabs reserves the right to suspend or terminate accounts that violate
                  these terms.
                </li>
              </ul>
            </Section>

            <Section title="4. Payments & Pricing">
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes.</li>
                <li>Payments are processed securely via Razorpay (UPI, Cards, Net Banking, EMI).</li>
                <li>Your enrollment is confirmed only upon successful payment.</li>
                <li>
                  ProCareerLabs reserves the right to change pricing at any time. Existing
                  enrollments will not be affected.
                </li>
              </ul>
            </Section>

            <Section title="5. Access & Course Use">
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Upon purchase, you are granted a personal, non-transferable license to access the content.</li>
                <li>Course access periods are as specified at the time of purchase.</li>
                <li>You may not share access links, credentials, or recordings with others.</li>
                <li>
                  Attempting to resell, redistribute, or commercially exploit any ProCareerLabs
                  content is strictly prohibited.
                </li>
              </ul>
            </Section>

            <Section title="6. Intellectual Property">
              <p>
                All content on ProCareerLabs — including videos, slides, templates, worksheets,
                graphics, and text — is the exclusive intellectual property of ProCareerLabs. You
                may not copy, reproduce, republish, or distribute any content without prior written
                permission.
              </p>
            </Section>

            <Section title="7. Prohibited Conduct">
              <p>You agree not to:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Use the platform for any unlawful purpose.</li>
                <li>Disrupt or interfere with the platform&apos;s functionality.</li>
                <li>Record, screenshot, or pirate workshop sessions.</li>
                <li>Harass or abuse instructors, staff, or other users.</li>
                <li>Use automated tools to access or scrape our content.</li>
              </ul>
            </Section>

            <Section title="8. Disclaimer of Warranties">
              <p>
                ProCareerLabs provides its platform &ldquo;as is&rdquo; without warranties of any kind,
                express or implied. We do not guarantee specific outcomes, career results, or income
                increases from using our content. Results vary based on individual effort, background,
                and market conditions.
              </p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, ProCareerLabs shall not be liable for any
                indirect, incidental, consequential, or punitive damages arising from your use of
                our platform. Our total liability shall not exceed the amount you paid for the
                specific service in question.
              </p>
            </Section>

            <Section title="10. Governing Law">
              <p>
                These Terms of Service are governed by the laws of India. Any disputes shall be
                subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
              </p>
            </Section>

            <Section title="11. Changes to Terms">
              <p>
                We may update these Terms at any time. Updated terms will be posted on this page.
                Continued use of the platform after changes constitutes acceptance of the revised
                terms.
              </p>
            </Section>

            <Section title="12. Contact">
              <p>
                For any questions regarding these Terms, contact us at:{" "}
                <a
                  href="mailto:neeraj.4all.kr@gmail.com"
                  style={{ color: "#60a5fa", textDecoration: "none" }}
                >
                  neeraj.4all.kr@gmail.com
                </a>
                <br />
                ProCareerLabs, Bangalore, Karnataka, India.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
