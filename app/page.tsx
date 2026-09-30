import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/marketing/Navbar";
import MarqueeTicker from "@/components/marketing/MarqueeTicker";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturedCohort from "@/components/marketing/FeaturedCohort";
import StatsSection from "@/components/marketing/StatsSection";
import PainPoints from "@/components/marketing/PainPoints";
import HowItWorks from "@/components/marketing/HowItWorks";
import CourseCatalog from "@/components/marketing/CourseCatalog";
import BonusStack from "@/components/marketing/BonusStack";
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

    // Site settings (stats, ticker)
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

  const stats = {
    students: settingsMap.stat_students ?? "12000",
    workshops: settingsMap.stat_workshops ?? "150",
    rating: settingsMap.stat_rating ?? "4.9",
    revenue: settingsMap.stat_revenue ?? "2.4 Cr+",
  };

  return (
    <main style={{ background: "#0a0f1e", minHeight: "100vh" }}>
      {/* Ticker + Nav */}
      <MarqueeTicker items={tickerItems} />
      <Navbar />

      {/* Hero */}
      <HeroSection cohort={cohort} />

      {/* Social Proof Stats */}
      <StatsSection stats={stats} />

      <div className="section-divider" />

      {/* Featured Cohort — dynamic from admin */}
      <FeaturedCohort cohort={cohort} />

      <div className="section-divider" />

      {/* Pain Points — interactive */}
      <PainPoints />

      <div className="section-divider" />

      {/* How It Works */}
      <HowItWorks />

      <div className="section-divider" />

      {/* Course Catalog */}
      <CourseCatalog courses={courses ?? undefined} />

      <div className="section-divider" />

      {/* Bonus Stack */}
      <BonusStack />

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
