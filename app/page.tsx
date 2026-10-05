import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/marketing/Navbar";
import MarqueeTicker from "@/components/marketing/MarqueeTicker";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturedCohort from "@/components/marketing/FeaturedCohort";
import StatsSection from "@/components/marketing/StatsSection";
import PainPoints from "@/components/marketing/PainPoints";
import BonusStack from "@/components/marketing/BonusStack";
import CourseCatalog from "@/components/marketing/CourseCatalog";
import InstructorSection from "@/components/marketing/InstructorSection";
import FAQSection from "@/components/marketing/FAQSection";
import Footer from "@/components/marketing/Footer";
import FloatingCTA from "@/components/marketing/FloatingCTA";

// Revalidate every 60s — admin changes show quickly without redeploy
export const revalidate = 60;

async function getHomeData() {
  try {
    const supabase = await createClient();

    // Cohort settings (featured live session)
    const { data: cohort } = await supabase
      .from("cohort_settings")
      .select("*, courses(title)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Site settings (stats, ticker, hero content)
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value");

    // Published courses
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title, description, price_inr, course_duration_hours, difficulty_level, slug")
      .eq("status", "published")
      .order("order_index", { ascending: true })
      .limit(4);

    const settingsMap = Object.fromEntries(
      (settings ?? []).map((s: any) => [s.key, s.value])
    );

    return { cohort, settingsMap, courses };
  } catch {
    // DB not configured yet — return nulls (fallback to defaults)
    return { cohort: null, settingsMap: {}, courses: null };
  }
}

export default async function HomePage() {
  const { cohort, settingsMap, courses } = await getHomeData();

  let tickerItems: string[] | undefined;
  try {
    tickerItems = settingsMap.ticker_items ? JSON.parse(settingsMap.ticker_items) : undefined;
  } catch {
    tickerItems = undefined;
  }

  // Hero content from admin (all optional — empty strings fall through to defaults)
  const heroContent = {
    headline: settingsMap.hero_headline || "",
    subheadline: settingsMap.hero_subheadline || "",
    badgeText: settingsMap.hero_badge_text || "",
    ctaText: settingsMap.hero_cta_text || "",
    ratingValue: settingsMap.hero_rating_value || "4.9",
    ratingLabel: settingsMap.hero_rating_label || "Avg Rating",
    studentsCount: settingsMap.hero_students_count || "12K+",
    studentsLabel: settingsMap.hero_students_label || "Professionals Trained",
    imageUrl: settingsMap.hero_image_url || "",
  };

  // Stats from admin
  const stat1 = { value: settingsMap.stat1_value, label: settingsMap.stat1_label };
  const stat2 = { value: settingsMap.stat2_value, label: settingsMap.stat2_label };
  const stat3 = { value: settingsMap.stat3_value, label: settingsMap.stat3_label };
  const stat4 = { value: settingsMap.stat4_value, label: settingsMap.stat4_label };

  return (
    <main style={{ background: "#0a0f1e", minHeight: "100vh" }}>
      {/* Ticker + Nav */}
      <MarqueeTicker items={tickerItems} />
      <Navbar />

      {/* Hero */}
      <HeroSection cohort={cohort} heroContent={heroContent} />

      {/* Social Proof Stats */}
      <StatsSection stat1={stat1} stat2={stat2} stat3={stat3} stat4={stat4} />

      <div className="section-divider" />

      {/* Featured Cohort — dynamic from admin */}
      <FeaturedCohort cohort={cohort} />

      <div className="section-divider" />

      {/* Pain Points — interactive */}
      <PainPoints />

      <div className="section-divider" />

      {/* Bonus Stack — swapped in place of How It Works */}
      <BonusStack />

      <div className="section-divider" />

      {/* Course Catalog */}
      <CourseCatalog courses={courses ?? undefined} />

      <div className="section-divider" />

      {/* Instructor */}
      <InstructorSection />

      <div className="section-divider" />

      {/* FAQ */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Floating CTA (sticky bottom) */}
      <FloatingCTA cohort={cohort} />
    </main>
  );
}
