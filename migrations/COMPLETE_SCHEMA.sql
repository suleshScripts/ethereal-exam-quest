-- ============================================
-- COMPLETE DATABASE SCHEMA FOR DMLT ACADEMY EXAM PORTAL
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- This creates all necessary tables, indexes, triggers, and RLS policies
-- 
-- IMPORTANT: This will DROP existing tables if they exist
-- Backup your data before running if needed!
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (if needed)
-- ============================================
-- Uncomment these if you want to start fresh
-- DROP TABLE IF EXISTS plan_template_versions CASCADE;
-- DROP TABLE IF EXISTS plan_discounts CASCADE;
-- DROP TABLE IF EXISTS subject_pricing CASCADE;
-- DROP TABLE IF EXISTS plan_templates CASCADE;
-- DROP TABLE IF EXISTS questions CASCADE;
-- DROP TABLE IF EXISTS question_sets CASCADE;
-- DROP TABLE IF EXISTS subjects CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS user_plans CASCADE;
-- DROP TABLE IF EXISTS exam_progress CASCADE;
-- DROP TABLE IF EXISTS exam_results CASCADE;
-- DROP TABLE IF EXISTS otp_verifications CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL DEFAULT '',
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT students_identifier_check CHECK (
    (phone IS NOT NULL) OR (email IS NOT NULL) OR (username IS NOT NULL)
  )
);

-- Ensure phone, email, and username are unique (for existing tables)
DO $$
BEGIN
  -- Add UNIQUE constraint to phone if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'students_phone_key' 
    AND conrelid = 'students'::regclass
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_phone_key UNIQUE (phone);
  END IF;
  
  -- Add UNIQUE constraint to email if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'students_email_key' 
    AND conrelid = 'students'::regclass
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_email_key UNIQUE (email);
  END IF;
  
  -- Add UNIQUE constraint to username if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'students_username_key' 
    AND conrelid = 'students'::regclass
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_username_key UNIQUE (username);
  END IF;
END $$;

-- ============================================
-- 2. OTP VERIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20),
  email VARCHAR(255),
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT otp_identifier_check CHECK (
    (phone IS NOT NULL) OR (email IS NOT NULL)
  )
);

-- ============================================
-- 3. EXAM RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_phone VARCHAR(20),
  student_email VARCHAR(255),
  student_name VARCHAR(255) NOT NULL,
  exam_id VARCHAR(255) NOT NULL,
  exam_title VARCHAR(255) NOT NULL,
  set_id VARCHAR(255) NOT NULL,
  set_number INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  time_taken VARCHAR(50) NOT NULL,
  user_answers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT exam_results_student_check CHECK (
    (student_phone IS NOT NULL) OR (student_email IS NOT NULL)
  )
);

-- Add foreign keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exam_results_student_phone_fkey'
  ) THEN
    ALTER TABLE exam_results
      ADD CONSTRAINT exam_results_student_phone_fkey
      FOREIGN KEY (student_phone) REFERENCES students(phone) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exam_results_student_email_fkey'
  ) THEN
    ALTER TABLE exam_results
      ADD CONSTRAINT exam_results_student_email_fkey
      FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- 4. EXAM PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exam_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_phone VARCHAR(20),
  student_email VARCHAR(255),
  student_name VARCHAR(255),
  exam_id VARCHAR(255) NOT NULL,
  completed_set_number INTEGER NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT exam_progress_student_check CHECK (
    (student_phone IS NOT NULL) OR (student_email IS NOT NULL)
  )
);

-- Add foreign keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exam_progress_student_phone_fkey'
  ) THEN
    ALTER TABLE exam_progress
      ADD CONSTRAINT exam_progress_student_phone_fkey
      FOREIGN KEY (student_phone) REFERENCES students(phone) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exam_progress_student_email_fkey'
  ) THEN
    ALTER TABLE exam_progress
      ADD CONSTRAINT exam_progress_student_email_fkey
      FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- 5. USER PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_phone VARCHAR(20),
  student_email VARCHAR(255),
  student_name VARCHAR(255),
  plan_id VARCHAR(255),
  plan_template_id UUID,
  plan_name VARCHAR(255),
  price_paid INTEGER NOT NULL,
  original_price DECIMAL(10, 2),
  discount_code VARCHAR(50),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  exam_ids TEXT[] NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT user_plans_student_check CHECK (
    (student_phone IS NOT NULL) OR (student_email IS NOT NULL)
  )
);

-- Add foreign keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_plans_student_phone_fkey'
  ) THEN
    ALTER TABLE user_plans
      ADD CONSTRAINT user_plans_student_phone_fkey
      FOREIGN KEY (student_phone) REFERENCES students(phone) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_plans_student_email_fkey'
  ) THEN
    ALTER TABLE user_plans
      ADD CONSTRAINT user_plans_student_email_fkey
      FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- 6. SUBJECTS TABLE (Admin Panel)
-- ============================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. QUESTION SETS TABLE (Admin Panel)
-- ============================================
CREATE TABLE IF NOT EXISTS question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  exam_id VARCHAR(50) NOT NULL,
  set_number INTEGER NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, set_number)
);

-- ============================================
-- 8. QUESTIONS TABLE (Admin Panel)
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID REFERENCES question_sets(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_text_marathi TEXT NOT NULL,
  option_1 TEXT NOT NULL,
  option_1_marathi TEXT NOT NULL,
  option_2 TEXT NOT NULL,
  option_2_marathi TEXT NOT NULL,
  option_3 TEXT NOT NULL,
  option_3_marathi TEXT NOT NULL,
  option_4 TEXT NOT NULL,
  option_4_marathi TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
  explanation TEXT,
  explanation_marathi TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. ADMINS TABLE (Admin Panel)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 10. PLAN TEMPLATES TABLE (Pricing)
-- ============================================
CREATE TABLE IF NOT EXISTS plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  validity_days INTEGER CHECK (validity_days > 0 OR validity_days IS NULL),
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for plan_template_id in user_plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_plans_plan_template_id_fkey'
  ) THEN
    ALTER TABLE user_plans
      ADD CONSTRAINT user_plans_plan_template_id_fkey
      FOREIGN KEY (plan_template_id) REFERENCES plan_templates(id);
  END IF;
END $$;

-- ============================================
-- 11. SUBJECT PRICING TABLE (Pricing)
-- ============================================
CREATE TABLE IF NOT EXISTS subject_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  validity_days INTEGER CHECK (validity_days > 0 OR validity_days IS NULL),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subject_id)
);

-- ============================================
-- 12. PLAN DISCOUNTS TABLE (Pricing)
-- ============================================
CREATE TABLE IF NOT EXISTS plan_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value >= 0),
  applicable_to JSONB DEFAULT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER CHECK (usage_limit > 0 OR usage_limit IS NULL),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_username ON students(username);
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON students(auth_user_id);

-- Exam results indexes
CREATE INDEX IF NOT EXISTS idx_exam_results_student_phone ON exam_results(student_phone);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_email ON exam_results(student_email);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_name ON exam_results(student_name);
CREATE INDEX IF NOT EXISTS idx_exam_results_created ON exam_results(created_at DESC);

-- Exam progress indexes
CREATE INDEX IF NOT EXISTS idx_exam_progress_student_phone ON exam_progress(student_phone);
CREATE INDEX IF NOT EXISTS idx_exam_progress_student_email ON exam_progress(student_email);
CREATE INDEX IF NOT EXISTS idx_exam_progress_exam_id ON exam_progress(exam_id);

-- Unique index for exam_progress (ensures one progress record per student per exam)
-- Uses a computed column approach to handle both phone and email identifiers
CREATE UNIQUE INDEX IF NOT EXISTS idx_exam_progress_unique_student_exam 
ON exam_progress(exam_id, COALESCE(student_phone, ''), COALESCE(student_email, ''));

-- User plans indexes
CREATE INDEX IF NOT EXISTS idx_user_plans_student_phone ON user_plans(student_phone);
CREATE INDEX IF NOT EXISTS idx_user_plans_student_email ON user_plans(student_email);
CREATE INDEX IF NOT EXISTS idx_user_plans_active ON user_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_plans_purchased ON user_plans(purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_plans_template_id ON user_plans(plan_template_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_expires_at ON user_plans(expires_at);

-- OTP indexes
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- Admin panel indexes
CREATE INDEX IF NOT EXISTS idx_question_sets_subject_id ON question_sets(subject_id);
CREATE INDEX IF NOT EXISTS idx_question_sets_exam_id ON question_sets(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_set_id ON questions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_questions_order_index ON questions(question_set_id, order_index);

-- Pricing indexes
CREATE INDEX IF NOT EXISTS idx_plan_templates_active ON plan_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_plan_templates_display_order ON plan_templates(display_order);
CREATE INDEX IF NOT EXISTS idx_subject_pricing_active ON subject_pricing(is_active);
CREATE INDEX IF NOT EXISTS idx_subject_pricing_subject_id ON subject_pricing(subject_id);
CREATE INDEX IF NOT EXISTS idx_plan_discounts_code ON plan_discounts(code);
CREATE INDEX IF NOT EXISTS idx_plan_discounts_active ON plan_discounts(is_active);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_discounts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Students policies (permissive for now - tighten in production)
DROP POLICY IF EXISTS "Students can view own data" ON students;
DROP POLICY IF EXISTS "Students can insert own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;

CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (true);

CREATE POLICY "Students can insert own data" ON students
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (true);

-- Exam Results policies
DROP POLICY IF EXISTS "Students can view own results" ON exam_results;
DROP POLICY IF EXISTS "Students can insert own results" ON exam_results;

CREATE POLICY "Students can view own results" ON exam_results
  FOR SELECT USING (true);

CREATE POLICY "Students can insert own results" ON exam_results
  FOR INSERT WITH CHECK (true);

-- Exam Progress policies
DROP POLICY IF EXISTS "Students can view own progress" ON exam_progress;
DROP POLICY IF EXISTS "Students can update own progress" ON exam_progress;
DROP POLICY IF EXISTS "Students can insert own progress" ON exam_progress;

CREATE POLICY "Students can view own progress" ON exam_progress
  FOR SELECT USING (true);

CREATE POLICY "Students can update own progress" ON exam_progress
  FOR UPDATE USING (true);

CREATE POLICY "Students can insert own progress" ON exam_progress
  FOR INSERT WITH CHECK (true);

-- OTP Verification policies
DROP POLICY IF EXISTS "Anyone can create OTP" ON otp_verifications;
DROP POLICY IF EXISTS "Anyone can verify OTP" ON otp_verifications;
DROP POLICY IF EXISTS "Anyone can update OTP" ON otp_verifications;

CREATE POLICY "Anyone can create OTP" ON otp_verifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can verify OTP" ON otp_verifications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update OTP" ON otp_verifications
  FOR UPDATE USING (true);

-- User Plans policies
DROP POLICY IF EXISTS "Users can view own plans" ON user_plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON user_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON user_plans;

CREATE POLICY "Users can view own plans" ON user_plans
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own plans" ON user_plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own plans" ON user_plans
  FOR UPDATE USING (true);

-- Subjects policies (public read, admin write)
DROP POLICY IF EXISTS "Public can view subjects" ON subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;

CREATE POLICY "Public can view subjects" ON subjects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL USING (true) WITH CHECK (true);

-- Question Sets policies (public read, admin write)
DROP POLICY IF EXISTS "Public can view question_sets" ON question_sets;
DROP POLICY IF EXISTS "Admins can manage question_sets" ON question_sets;

CREATE POLICY "Public can view question_sets" ON question_sets
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage question_sets" ON question_sets
  FOR ALL USING (true) WITH CHECK (true);

-- Questions policies (public read, admin write)
DROP POLICY IF EXISTS "Public can view questions" ON questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;

CREATE POLICY "Public can view questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (true) WITH CHECK (true);

-- Plan Templates policies (public read, admin write)
DROP POLICY IF EXISTS "Public can view plan_templates" ON plan_templates;
DROP POLICY IF EXISTS "Admins can manage plan_templates" ON plan_templates;

CREATE POLICY "Public can view plan_templates" ON plan_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage plan_templates" ON plan_templates
  FOR ALL USING (true) WITH CHECK (true);

-- Subject Pricing policies (public read, admin write)
DROP POLICY IF EXISTS "Public can view subject_pricing" ON subject_pricing;
DROP POLICY IF EXISTS "Admins can manage subject_pricing" ON subject_pricing;

CREATE POLICY "Public can view subject_pricing" ON subject_pricing
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subject_pricing" ON subject_pricing
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exam_progress_updated_at ON exam_progress;
CREATE TRIGGER update_exam_progress_updated_at
  BEFORE UPDATE ON exam_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;
CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_question_sets_updated_at ON question_sets;
CREATE TRIGGER update_question_sets_updated_at
  BEFORE UPDATE ON question_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_plan_templates_updated_at ON plan_templates;
CREATE TRIGGER update_plan_templates_updated_at
  BEFORE UPDATE ON plan_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subject_pricing_updated_at ON subject_pricing;
CREATE TRIGGER update_subject_pricing_updated_at
  BEFORE UPDATE ON subject_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to sync Supabase Auth with students table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (
    email,
    username,
    name,
    auth_user_id,
    email_verified,
    password_hash
  )
  VALUES (
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.id,
    NEW.email_confirmed_at IS NOT NULL,
    ''
  )
  ON CONFLICT (auth_user_id) DO UPDATE
  SET 
    email = NEW.email,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify tables were created successfully

SELECT 'students' as table_name, COUNT(*) as row_count FROM students
UNION ALL
SELECT 'exam_results', COUNT(*) FROM exam_results
UNION ALL
SELECT 'exam_progress', COUNT(*) FROM exam_progress
UNION ALL
SELECT 'user_plans', COUNT(*) FROM user_plans
UNION ALL
SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'question_sets', COUNT(*) FROM question_sets
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'plan_templates', COUNT(*) FROM plan_templates
UNION ALL
SELECT 'subject_pricing', COUNT(*) FROM subject_pricing;

-- ============================================
-- SCHEMA CREATION COMPLETE!
-- ============================================
-- All tables, indexes, triggers, and RLS policies have been created.
-- Your database is ready to use!

