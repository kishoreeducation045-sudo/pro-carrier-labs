"use client";
import Link from "next/link";
import { ArrowRight, Users, Clock, Star, Zap, BarChart2, FileText, Globe } from "lucide-react";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_inr: number;
  original_price?: number;
  course_duration_hours: number;
  difficulty_level: string;
  enrollment_count?: number;
  badge?: string;
  badge_color?: string;
  icon?: string;
}

interface CourseCatalogProps {
  courses?: Course[];
}

const DEFAULT_COURSES: Course[] = [
  {
    id: "1",
    slug: "ai-masterclass",
    title: "AI Masterclass with Neeraj Kumar",
    description: "Learn to use ChatGPT, Gemini, and AI agents to earn ₹50K–₹1L extra per month — without coding.",
    price_inr: 299,
    original_price: 2999,
    course_duration_hours: 3,
    difficulty_level: "beginner",
    enrollment_count: 12000,
    badge: "🔥 Most Popular",
    badge_color: "#f5a623",
    icon: "ai",
  },
  {
    id: "2",
    slug: "linkedin-growth",
    title: "LinkedIn Growth Masterclass",
    description: "Build a powerful LinkedIn presence that attracts jobs, clients, and opportunities on autopilot.",
    price_inr: 499,
    course_duration_hours: 4,
    difficulty_level: "beginner",
    enrollment_count: 4500,
    badge: "⭐ New",
    badge_color: "#1e6fff",
    icon: "linkedin",
  },
  {
    id: "3",
    slug: "resume-career-coaching",
    title: "Resume & Career Coaching",
    description: "Craft an ATS-beating resume, ace interviews, and land your dream job with Neeraj's proven framework.",
    price_inr: 999,
    course_duration_hours: 6,
    difficulty_level: "intermediate",
    enrollment_count: 2800,
    icon: "resume",
  },
  {
    id: "4",
    slug: "ca-intermediate",
    title: "CA Intermediate Prep",
    description: "Structured coaching for CA Intermediate with expert faculty, practice tests, and live doubt sessions.",
    price_inr: 4999,
    course_duration_hours: 120,
    difficulty_level: "advanced",
    enrollment_count: 850,
    badge: "🎓 Professional",
    badge_color: "#10b981",
    icon: "ca",
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  ai: <Zap size={28} />,
  linkedin: <Globe size={28} />,
  resume: <FileText size={28} />,
  ca: <BarChart2 size={28} />,
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "#10b981",
  intermediate: "#f5a623",
  advanced: "#ef4444",
};

export default function CourseCatalog({ courses = DEFAULT_COURSES }: CourseCatalogProps) {
  return (
    <section
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1526 100%)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            All Courses
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              color: "#f9fafb",
              margin: "0 0 0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Learn. Grow. Earn.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.0625rem", margin: 0 }}>
            Expert-led courses designed for working professionals in India
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "rgba(17,24,39,0.9)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,111,255,0.35)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(30,111,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(30,111,255,0.12), rgba(245,166,35,0.06))",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    padding: "1.75rem",
                    position: "relative",
                  }}
                >
                  {/* Badge */}
                  {course.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: `${course.badge_color}20`,
                        border: `1px solid ${course.badge_color}40`,
                        color: course.badge_color,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.625rem",
                        borderRadius: 9999,
                      }}
                    >
                      {course.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: "rgba(30,111,255,0.15)",
                      border: "1px solid rgba(30,111,255,0.2)",
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1e6fff",
                      marginBottom: "1rem",
                    }}
                  >
                    {ICON_MAP[course.icon ?? "ai"]}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "#f9fafb",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {course.title}
                  </h3>
                </div>

                {/* Card body */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: 1.6, flex: 1 }}>
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#64748b", fontSize: "0.8125rem" }}>
                      <Clock size={13} />
                      {course.course_duration_hours}h
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#64748b", fontSize: "0.8125rem" }}>
                      <Users size={13} />
                      {(course.enrollment_count ?? 0).toLocaleString("en-IN")}+
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontSize: "0.8125rem",
                        color: DIFFICULTY_COLOR[course.difficulty_level] ?? "#94a3b8",
                        textTransform: "capitalize",
                      }}
                    >
                      <Star size={13} />
                      {course.difficulty_level}
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "1.375rem", fontWeight: 800, color: "#f9fafb" }}>
                        ₹{course.price_inr.toLocaleString("en-IN")}
                      </span>
                      {course.original_price && (
                        <span style={{ fontSize: "0.8125rem", color: "#64748b", textDecoration: "line-through", marginLeft: "0.5rem" }}>
                          ₹{course.original_price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        color: "#1e6fff",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      Enroll <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
