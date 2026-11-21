import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "Privacy Policy | ProCareerLabs",
  description: "Learn how ProCareerLabs collects, uses, and protects your personal data.",
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

export default function PrivacyPage() {
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
              Privacy Policy
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
            <Section title="1. Who We Are">
              <p>
                ProCareerLabs (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is an AI-powered online
                education platform based in Bangalore, Karnataka, India. We offer live workshops,
                masterclasses, and digital learning resources to working professionals across India.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                For any privacy-related queries, contact us at:{" "}
                <a
                  href="mailto:neeraj.4all.kr@gmail.com"
                  style={{ color: "#60a5fa", textDecoration: "none" }}
                >
                  neeraj.4all.kr@gmail.com
                </a>
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We collect the following types of information:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Account Information:</strong> Your name,
                  email address, and password when you register.
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Payment Information:</strong> Transaction
                  details processed by Razorpay. We do not store your card or bank credentials.
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Usage Data:</strong> Pages visited, time
                  spent, clicks, and device/browser information collected via analytics tools.
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Communications:</strong> Messages sent
                  through our contact form or email correspondence.
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Cookies:</strong> Session cookies and
                  preference tokens to keep you logged in and improve your experience.
                </li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>To provide access to purchased workshops and course materials.</li>
                <li>To process payments and issue invoices via Razorpay.</li>
                <li>To send important updates, receipts, and service notifications.</li>
                <li>To improve our platform through usage analytics.</li>
                <li>To respond to your support queries and feedback.</li>
                <li>To send promotional content — you may unsubscribe at any time.</li>
              </ul>
            </Section>

            <Section title="4. Third-Party Services">
              <p>We share data with trusted third-party providers only as necessary:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Razorpay</strong> — Payment processing
                  (subject to Razorpay&apos;s Privacy Policy).
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Supabase</strong> — Secure database and
                  authentication infrastructure.
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Google Analytics</strong> — Anonymous
                  usage analytics to improve our platform.
                </li>
                <li>
                  <strong style={{ color: "#f9fafb" }}>Vercel</strong> — Hosting and content
                  delivery.
                </li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>
                We do not sell, rent, or trade your personal data to any third party for marketing
                purposes.
              </p>
            </Section>

            <Section title="5. Data Security">
              <p>
                We implement industry-standard security measures including HTTPS encryption, secure
                password hashing, and access-controlled databases. While we strive to protect your
                data, no system is 100% secure and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="6. Data Retention">
              <p>
                We retain your account data for as long as your account is active or as needed to
                provide services. You may request deletion of your account and associated data at
                any time by emailing us.
              </p>
            </Section>

            <Section title="7. Your Rights">
              <p>Under applicable Indian data protection laws, you have the right to:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data (subject to legal obligations).</li>
                <li>Withdraw consent to marketing communications at any time.</li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>
                To exercise any of these rights, email:{" "}
                <a
                  href="mailto:neeraj.4all.kr@gmail.com"
                  style={{ color: "#60a5fa", textDecoration: "none" }}
                >
                  neeraj.4all.kr@gmail.com
                </a>
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                We use essential cookies for authentication and session management, and analytics
                cookies to understand how visitors interact with our platform. You can disable
                cookies in your browser settings, but this may affect your ability to log in.
              </p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated effective date. Continued use of our platform after changes
                constitutes acceptance.
              </p>
            </Section>

            <Section title="10. Contact">
              <p>
                For any privacy concerns, write to us at:{" "}
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
