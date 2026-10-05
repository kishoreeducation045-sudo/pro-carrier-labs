"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Clock,
  Star,
  Zap,
  BarChart2,
  FileText,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
    slug: "prompt-engineering-pro",
    title: "Prompt Engineering & Agentic AI Pro",
    description: "Master structured prompting, few-shot chain of thought, evaluation frameworks, and agent orchestration.",
    price_inr: 499,
    original_price: 3999,
    course_duration_hours: 5,
    difficulty_level: "intermediate",
    enrollment_count: 6500,
    badge: "⭐ Advanced",
    badge_color: "#1e6fff",
    icon: "ai",
  },
  {
    id: "3",
    slug: "fullstack-ai-developer",
    title: "Fullstack AI Developer Bootcamp",
    description: "Ship complete AI-powered products with Next.js, Supabase, OpenAI & Claude APIs, and Stripe/Razorpay.",
    price_inr: 999,
    original_price: 6999,
    course_duration_hours: 12,
    difficulty_level: "intermediate",
    enrollment_count: 4200,
    badge: "🚀 Best Value",
    badge_color: "#10b981",
    icon: "globe",
  },
  {
    id: "4",
    slug: "nocode-ai-automation",
    title: "No-Code AI Automation for Business",
    description: "Leverage Make.com, Zapier, n8n, and OpenAI to build autonomous lead generators and workflow bots.",
    price_inr: 399,
    original_price: 2999,
    course_duration_hours: 4,
    difficulty_level: "beginner",
    enrollment_count: 3800,
    icon: "resume",
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  ai: <Zap size={26} />,
  globe: <Globe size={26} />,
  linkedin: <Globe size={26} />,
  resume: <FileText size={26} />,
  ca: <BarChart2 size={26} />,
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "#10b981",
  intermediate: "#f5a623",
  advanced: "#ef4444",
};

export default function CourseCatalog({ courses = DEFAULT_COURSES }: CourseCatalogProps) {
  const displayCourses = courses && courses.length > 0 ? courses : DEFAULT_COURSES;
  const isHorizontalScroll = displayCourses.length > 4;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [displayCourses]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 310; // width of card + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="courses"
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1526 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: isHorizontalScroll ? "space-between" : "center",
            alignItems: "flex-end",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ textAlign: isHorizontalScroll ? "left" : "center", flex: isHorizontalScroll ? "1" : "auto" }}>
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
              All Courses & Masterclasses ({displayCourses.length})
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

          {/* Navigation Arrows for Horizontal Carousel */}
          {isHorizontalScroll && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 600, marginRight: "0.25rem" }} className="hidden sm:inline">
                Scroll to explore →
              </span>
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: canScrollLeft ? "rgba(30, 111, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  border: canScrollLeft ? "1px solid rgba(30, 111, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                  color: canScrollLeft ? "#60a5fa" : "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canScrollLeft ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: canScrollRight ? "rgba(30, 111, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  border: canScrollRight ? "1px solid rgba(30, 111, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                  color: canScrollRight ? "#60a5fa" : "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canScrollRight ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Courses Container: Horizontal Scroll if > 4, or Grid if <= 4 */}
        <div
          ref={scrollRef}
          style={{
            display: isHorizontalScroll ? "flex" : "grid",
            gridTemplateColumns: isHorizontalScroll ? undefined : "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1.5rem",
            overflowX: isHorizontalScroll ? "auto" : "visible",
            scrollSnapType: isHorizontalScroll ? "x mandatory" : undefined,
            scrollBehavior: "smooth",
            paddingBottom: isHorizontalScroll ? "1.5rem" : "0",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(30, 111, 255, 0.3) rgba(255, 255, 255, 0.04)",
          }}
        >
          {displayCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              style={{
                textDecoration: "none",
                flex: isHorizontalScroll ? "0 0 290px" : undefined,
                minWidth: isHorizontalScroll ? 290 : undefined,
                maxWidth: isHorizontalScroll ? 310 : undefined,
                scrollSnapAlign: isHorizontalScroll ? "start" : undefined,
              }}
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
                    padding: "1.5rem",
                    position: "relative",
                  }}
                >
                  {/* Badge */}
                  {course.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        background: `${course.badge_color || "#1e6fff"}20`,
                        border: `1px solid ${course.badge_color || "#1e6fff"}40`,
                        color: course.badge_color || "#60a5fa",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        borderRadius: 9999,
                      }}
                    >
                      {course.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      background: "rgba(30,111,255,0.15)",
                      border: "1px solid rgba(30,111,255,0.25)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1e6fff",
                      marginBottom: "0.875rem",
                    }}
                  >
                    {ICON_MAP[course.icon ?? "ai"] || <Zap size={26} />}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "#f9fafb",
                      margin: 0,
                      lineHeight: 1.4,
                      minHeight: "2.8rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.title}
                  </h3>
                </div>

                {/* Card body */}
                <div style={{ padding: "1.375rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.875rem",
                      margin: 0,
                      lineHeight: 1.5,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#64748b", fontSize: "0.8125rem" }}>
                      <Clock size={13} />
                      {course.course_duration_hours}h
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#64748b", fontSize: "0.8125rem" }}>
                      <Users size={13} />
                      {(course.enrollment_count ?? 1200).toLocaleString("en-IN")}+
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontSize: "0.8125rem",
                        color: DIFFICULTY_COLOR[course.difficulty_level?.toLowerCase()] ?? "#10b981",
                        textTransform: "capitalize",
                      }}
                    >
                      <Star size={13} />
                      {course.difficulty_level || "All Levels"}
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.875rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f9fafb" }}>
                        ₹{Number(course.price_inr).toLocaleString("en-IN")}
                      </span>
                      {course.original_price && (
                        <span style={{ fontSize: "0.8125rem", color: "#64748b", textDecoration: "line-through", marginLeft: "0.5rem" }}>
                          ₹{Number(course.original_price).toLocaleString("en-IN")}
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
                      Enroll <ArrowRight size={15} />
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

