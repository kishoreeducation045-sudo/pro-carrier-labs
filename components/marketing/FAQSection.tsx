"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Who is this course for?",
    a: "This is for working professionals — salaried employees, freelancers, consultants, and business owners — who want to use AI to earn more or save time. No technical background needed.",
  },
  {
    q: "Do I need to know coding or AI tools beforehand?",
    a: "Absolutely not. Neeraj teaches from scratch, assuming zero prior knowledge. If you can use WhatsApp, you can learn what's taught here.",
  },
  {
    q: "Will I get a recording after the live session?",
    a: "Yes! Lifetime access to recordings and all course materials is included with every enrollment.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. We offer a 7-day refund policy, no questions asked. If you're not satisfied within 7 days of enrollment, just contact support and we'll process your refund.",
  },
  {
    q: "How do I join the live session?",
    a: "After enrollment, you'll receive a Zoom link via email and on your dashboard. Simply click to join on the scheduled date and time.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes! Upon completing the course (100% progress), you'll automatically receive a ProCareerLabs certificate of completion, shareable on LinkedIn.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI, credit/debit cards, net banking, and EMI options — all processed securely through Razorpay.",
  },
  {
    q: "Can I access the course on mobile?",
    a: "Yes, the student portal is fully mobile-responsive. You can learn on your phone, tablet, or desktop.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1526 100%)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(30,111,255,0.1)",
              border: "1px solid rgba(30,111,255,0.25)",
              color: "#60a5fa",
              fontSize: "0.8125rem",
              fontWeight: 700,
              padding: "0.375rem 1rem",
              borderRadius: 9999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            FAQ
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              color: "#f9fafb",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Questions, answered
          </h2>
        </div>

        <div
          style={{
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: i < FAQS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "1.375rem 1.75rem",
                  background: "none",
                  border: "none",
                  color: open === i ? "#f9fafb" : "#d1d5db",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  transition: "all 0.2s",
                }}
              >
                {faq.q}
                <div
                  style={{
                    flexShrink: 0,
                    color: open === i ? "#1e6fff" : "#64748b",
                    transition: "transform 0.3s ease",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ChevronDown size={20} />
                </div>
              </button>

              <div
                style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p
                  style={{
                    padding: "0 1.75rem 1.375rem",
                    color: "#94a3b8",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
