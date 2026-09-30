-- ========================================================
-- ProCareerLabs 2.0 Complete Database Schema & Seed Data
-- ========================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== 1. USERS & ROLES ====================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin', 'course_admin', 'content_manager')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 2. STUDENT PROFILES ====================
CREATE SEQUENCE IF NOT EXISTS student_id_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  student_id VARCHAR(30) UNIQUE NOT NULL, -- e.g. "PCL-2025-01001"
  phone VARCHAR(25),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Function to auto-generate student ID sequence
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.student_id IS NULL OR NEW.student_id = '' THEN
    NEW.student_id := 'PCL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('student_id_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_set_student_id ON public.student_profiles;
CREATE TRIGGER tr_set_student_id
  BEFORE INSERT ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_student_id();

-- ==================== 3. COURSES ====================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  headline TEXT,
  description TEXT,
  category VARCHAR(100) DEFAULT 'Artificial Intelligence',
  price_inr DECIMAL(10,2) NOT NULL DEFAULT 299,
  original_price_inr DECIMAL(10,2) DEFAULT 2999,
  course_duration_hours INT DEFAULT 3,
  difficulty_level VARCHAR(50) DEFAULT 'Beginner to Intermediate',
  thumbnail_url TEXT,
  drive_url TEXT,
  zoom_link TEXT,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  order_index INT DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  curriculum JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 4. COHORT SETTINGS (Homepage dynamic live session) ====================
CREATE TABLE IF NOT EXISTS public.cohort_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'AI Masterclass with Neeraj Kumar',
  headline TEXT NOT NULL DEFAULT 'Build, Automate & Scale with Generative AI in 3 Hours',
  subheadline TEXT DEFAULT 'Join 12,000+ professionals mastering prompt engineering, autonomous agents & workflow automation.',
  cohort_date TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '3 days'),
  duration_hours INT DEFAULT 3,
  max_seats INT DEFAULT 100,
  seats_taken INT DEFAULT 87,
  price_inr DECIMAL(10,2) DEFAULT 299,
  original_price_inr DECIMAL(10,2) DEFAULT 2999,
  zoom_link TEXT DEFAULT 'https://zoom.us/j/pcl-live-masterclass',
  is_active BOOLEAN DEFAULT TRUE,
  show_countdown BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 5. SITE SETTINGS ====================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label VARCHAR(255),
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 6. TRANSACTIONS (with Razorpay UTR ID & student info) ====================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE SET NULL,
  student_id_code VARCHAR(50),      -- e.g. "PCL-2025-01001"
  student_name VARCHAR(255),
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(50),
  student_address TEXT,
  razorpay_order_id VARCHAR(255) NOT NULL,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  razorpay_utr_id VARCHAR(255),     -- Bank UTR Number / Acquirer reference
  amount_inr DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  refund_reason TEXT,
  refund_id VARCHAR(255),
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 7. ENROLLMENTS ====================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE SET NULL,
  progress_percent INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'refunded')),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- ==================== 8. CERTIFICATES ====================
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  certificate_code VARCHAR(100) UNIQUE NOT NULL, -- e.g. "PCL-CERT-982341"
  student_name VARCHAR(255) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  pdf_url TEXT
);

-- ==================== 9. ADMIN INVITES ====================
CREATE TABLE IF NOT EXISTS public.admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.users(id),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 10. TESTIMONIALS ====================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  role VARCHAR(150),
  company VARCHAR(150),
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  featured BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 11. AUTOMATIC PROFILE TRIGGER ON SIGNUP ====================
GRANT ALL ON SEQUENCE student_id_seq TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.student_profiles TO postgres, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_full_name TEXT;
  user_role TEXT;
  new_student_code VARCHAR(30);
BEGIN
  -- Extract name from metadata or email
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Set admin role if email matches known admins
  IF LOWER(NEW.email) = 'admin@procareerlabs.com' OR LOWER(NEW.email) = 'mahalakshmi.education8915@gmail.com' THEN
    user_role := 'super_admin';
  ELSE
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  END IF;

  -- 1. Insert or update public.users
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    user_full_name,
    NEW.raw_user_meta_data->>'avatar_url',
    user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    role = CASE WHEN users.role = 'super_admin' THEN 'super_admin' ELSE EXCLUDED.role END,
    updated_at = NOW();

  -- 2. Insert into student_profiles safely
  BEGIN
    new_student_code := 'PCL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('student_id_seq')::TEXT, 5, '0');
    INSERT INTO public.student_profiles (user_id, student_id, phone, profile_complete)
    VALUES (
      NEW.id,
      new_student_code,
      NEW.raw_user_meta_data->>'phone',
      CASE WHEN NEW.raw_user_meta_data->>'phone' IS NOT NULL THEN TRUE ELSE FALSE END
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Fallback: Do not fail auth signup if profile generation encounters constraint
  END;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block auth user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== 12. ROW LEVEL SECURITY (RLS) ====================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Helper to check if caller is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin', 'course_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read policies
CREATE POLICY "Public can view published courses" ON public.courses FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Public can view active cohort settings" ON public.cohort_settings FOR SELECT USING (true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view and edit own profile" ON public.users FOR ALL USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can view and edit own student profile" ON public.student_profiles FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Admin full access policies
CREATE POLICY "Admins full access courses" ON public.courses FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access cohort_settings" ON public.cohort_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access site_settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access transactions" ON public.transactions FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access enrollments" ON public.enrollments FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access certificates" ON public.certificates FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access admin_invites" ON public.admin_invites FOR ALL USING (public.is_admin());

-- ==================== 13. SEED DATA ====================
-- Seed default courses
INSERT INTO public.courses (slug, title, headline, description, category, price_inr, original_price_inr, course_duration_hours, difficulty_level, features, curriculum, order_index)
VALUES 
(
  'ai-masterclass',
  'AI Masterclass with Neeraj Kumar',
  'Build, Automate & Scale with Generative AI in 3 Hours',
  'A hands-on, live 3-hour intensive session where you will learn to build AI agents, automate enterprise workflows, write high-converting prompts, and monetize your AI skills.',
  'Artificial Intelligence',
  299.00,
  2999.00,
  3,
  'All Levels',
  '["3 Hours Live Interactive Masterclass", "Exclusive 500+ Prompt Vault (₹4,999 Value)", "Autonomous AI Agent Blueprint (₹6,999 Value)", "Lifetime Access to Class Recordings", "Official ProCareerLabs Verifiable Certificate", "VIP WhatsApp Mastermind Community"]'::jsonb,
  '[
    {"module": "Module 1", "title": "Generative AI Foundations & Architecture", "duration": "45 mins", "topics": ["Understanding LLM architectures", "Prompt Engineering Mastery", "Context window & reasoning tricks"]},
    {"module": "Module 2", "title": "Autonomous AI Agents & Multi-Agent Workflows", "duration": "60 mins", "topics": ["Designing agentic pipelines", "Tool use & function calling", "Automating business operations"]},
    {"module": "Module 3", "title": "Enterprise Automation & Real-World Projects", "duration": "45 mins", "topics": ["Connecting AI to spreadsheets, databases & CRM", "Zero-code AI micro-apps", "Production deployment patterns"]},
    {"module": "Module 4", "title": "Monetization, Career Acceleration & Q&A", "duration": "30 mins", "topics": ["Freelancing with AI", "Consulting frameworks for ₹1L+ gigs", "Live interactive Q&A"]}
  ]'::jsonb,
  1
),
(
  'prompt-engineering-pro',
  'Prompt Engineering & Agentic AI Pro',
  'Advanced Prompt Architecture for Enterprise Developers & Analysts',
  'Master structured prompting, few-shot chain of thought, evaluation frameworks, and agent orchestration for high-accuracy production systems.',
  'Advanced AI',
  499.00,
  3999.00,
  5,
  'Intermediate to Advanced',
  '["5 Hours Deep Dive Video & Code", "Production Evaluation Benchmark Suite", "LangChain & LlamaIndex starter templates", "Certificate of Specialization"]'::jsonb,
  '[
    {"module": "Module 1", "title": "Reasoning & Few-Shot Techniques", "duration": "60 mins", "topics": ["ReAct frameworks", "Tree-of-thought prompting", "Structured JSON extraction"]},
    {"module": "Module 2", "title": "Agentic Workflows with Python & LangGraph", "duration": "90 mins", "topics": ["State machines for agents", "Human-in-the-loop validation", "Error recovery"]}
  ]'::jsonb,
  2
),
(
  'fullstack-ai-developer',
  'Fullstack AI Developer Bootcamp',
  'Build Modern Next.js + AI SaaS Applications from Scratch',
  'Ship complete AI-powered products with Next.js 14, Supabase, Tailwind, OpenAI & Claude APIs, Stripe/Razorpay billing, and vector embeddings.',
  'Web Development',
  999.00,
  6999.00,
  12,
  'Intermediate',
  '["12 Hours Comprehensive Project-Based Course", "3 Full-Stack SaaS Source Codes", "Deployment to Vercel & AWS", "Lifetime Code Updates"]'::jsonb,
  '[
    {"module": "Module 1", "title": "Next.js 14 App Router & Streaming AI UI", "duration": "3 hrs", "topics": ["Vercel AI SDK", "RAG architectures", "Vector databases"]},
    {"module": "Module 2", "title": "Authentication, Database & Payments", "duration": "4 hrs", "topics": ["Supabase auth & RLS", "Razorpay webhooks", "Subscription management"]}
  ]'::jsonb,
  3
),
(
  'nocode-ai-automation',
  'No-Code AI Automation for Business',
  'Automate 80% of Repetitive Operations without Writing Code',
  'Leverage Make.com, Zapier, n8n, and OpenAI to build autonomous lead generators, content machines, customer support bots, and financial reconcilers.',
  'Automation',
  399.00,
  2999.00,
  4,
  'Beginner',
  '["4 Hours Step-by-Step Walkthrough", "25+ Ready-to-import Automation Blueprints", "Weekly Automation Clinic Access", "Certificate of Completion"]'::jsonb,
  '[
    {"module": "Module 1", "title": "Make & Zapier AI Automations", "duration": "90 mins", "topics": ["Webhook triggers", "AI parsing", "CRM sync"]},
    {"module": "Module 2", "title": "Autonomous Customer Support & Content Pipelines", "duration": "90 mins", "topics": ["WhatsApp bots", "Social media auto-publishers", "Analytics alerts"]}
  ]'::jsonb,
  4
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Cohort Settings
INSERT INTO public.cohort_settings (
  title, headline, subheadline, cohort_date, duration_hours, max_seats, seats_taken, price_inr, original_price_inr, is_active, show_countdown
)
VALUES (
  'AI Masterclass with Neeraj Kumar',
  'Build, Automate & Scale with Generative AI in 3 Hours',
  'Join 12,000+ professionals mastering prompt engineering, autonomous agents & workflow automation.',
  (now() + interval '3 days 19 hours 30 minutes'),
  3,
  100,
  87,
  299.00,
  2999.00,
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Seed Site Settings
INSERT INTO public.site_settings (key, value, label)
VALUES
  ('ticker_items', '["🎁 5 Free Bonuses worth ₹23,500+ included", "👥 12,000+ Working Professionals Trained", "⭐ 4.9/5 Rating from 15,000+ Alumni", "🔥 Only 13 seats remaining for upcoming cohort!", "⏰ Limited Offer — Price resets to ₹2,999 soon"]', 'Ticker bar items'),
  ('stat_students', '12,000+', 'Students trained count'),
  ('stat_workshops', '150+', 'Workshops conducted'),
  ('stat_rating', '4.9/5', 'Average rating'),
  ('stat_revenue', '₹2.4 Cr+', 'Client revenue unlocked')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, featured, order_index)
VALUES
  ('Rohan Deshmukh', 'Senior Product Manager', 'FinTech Unicorn', 'Neeraj cuts through the hype and shows real, tangible AI workflows. I automated our sprint planning and competitive intelligence within 48 hours of the masterclass. Unbelievable ROI for ₹299!', 5.0, true, 1),
  ('Priyanka Iyer', 'Growth Lead', 'SaaS Scaleup', 'The prompt engineering frameworks alone saved our marketing team over 25 hours a week. The live examples were mind-blowing.', 5.0, true, 2),
  ('Aditya Saxena', 'Full Stack Engineer', 'Global Tech Services', 'Best 3 hours spent this quarter. The autonomous agent blueprints gave me the exact architecture I needed to ship our client demo.', 5.0, true, 3),
  ('Ananya Roy', 'Operations Director', 'E-Commerce Enterprise', 'From zero AI experience to automating customer onboarding. The session pace is crisp, practical and high-energy!', 5.0, true, 4)
ON CONFLICT DO NOTHING;
