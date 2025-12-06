-- ============================================
-- CRITICAL SECURITY FIXES
-- ============================================
-- This file fixes:
-- 1. RLS (Row Level Security) - prevents unauthorized data access
-- 2. Email verification system
-- 3. Secure database access
-- ============================================

-- STEP 1: ENABLE ROW LEVEL SECURITY (RLS)
-- This prevents users from seeing other users' data via Burp Suite or direct API calls
-- ============================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: CREATE RLS POLICIES FOR STUDENTS TABLE
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON students;
DROP POLICY IF EXISTS "Users can update own profile" ON students;
DROP POLICY IF EXISTS "Service role can do anything" ON students;
DROP POLICY IF EXISTS "Allow signup" ON students;

-- Policy 1: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON students
  FOR SELECT
  USING (
    auth.uid()::text = id::text
    OR
    current_setting('request.jwt.claims', true)::json->>'userId' = id::text
  );

-- Policy 2: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON students
  FOR UPDATE
  USING (
    auth.uid()::text = id::text
    OR
    current_setting('request.jwt.claims', true)::json->>'userId' = id::text
  );

-- Policy 3: Allow service role (backend) to do anything
CREATE POLICY "Service role can do anything" ON students
  FOR ALL
  USING (current_user = 'service_role');

-- Policy 4: Allow public signup (INSERT only)
CREATE POLICY "Allow signup" ON students
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- STEP 3: CREATE RLS POLICIES FOR SESSIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON sessions;
DROP POLICY IF EXISTS "Service role can manage sessions" ON sessions;

CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT
  USING (
    auth.uid()::text = user_id::text
    OR
    current_setting('request.jwt.claims', true)::json->>'userId' = user_id::text
  );

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE
  USING (
    auth.uid()::text = user_id::text
    OR
    current_setting('request.jwt.claims', true)::json->>'userId' = user_id::text
  );

CREATE POLICY "Service role can manage sessions" ON sessions
  FOR ALL
  USING (current_user = 'service_role');

-- ============================================
-- STEP 4: CREATE RLS POLICIES FOR USER_PLANS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own plans" ON user_plans;
DROP POLICY IF EXISTS "Service role can manage plans" ON user_plans;

CREATE POLICY "Users can view own plans" ON user_plans
  FOR SELECT
  USING (
    student_phone IN (
      SELECT phone FROM students 
      WHERE id::text = auth.uid()::text
      OR id::text = current_setting('request.jwt.claims', true)::json->>'userId'
    )
  );

CREATE POLICY "Service role can manage plans" ON user_plans
  FOR ALL
  USING (current_user = 'service_role');

-- ============================================
-- STEP 5: CREATE RLS POLICIES FOR EXAM_RESULTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own results" ON exam_results;
DROP POLICY IF EXISTS "Users can insert own results" ON exam_results;
DROP POLICY IF EXISTS "Service role can manage results" ON exam_results;

CREATE POLICY "Users can view own results" ON exam_results
  FOR SELECT
  USING (
    student_phone IN (
      SELECT phone FROM students 
      WHERE id::text = auth.uid()::text
      OR id::text = current_setting('request.jwt.claims', true)::json->>'userId'
    )
  );

CREATE POLICY "Users can insert own results" ON exam_results
  FOR INSERT
  WITH CHECK (
    student_phone IN (
      SELECT phone FROM students 
      WHERE id::text = auth.uid()::text
      OR id::text = current_setting('request.jwt.claims', true)::json->>'userId'
    )
  );

CREATE POLICY "Service role can manage results" ON exam_results
  FOR ALL
  USING (current_user = 'service_role');

-- ============================================
-- STEP 6: CREATE RLS POLICIES FOR EXAM_PROGRESS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own progress" ON exam_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON exam_progress;
DROP POLICY IF EXISTS "Service role can manage progress" ON exam_progress;

CREATE POLICY "Users can view own progress" ON exam_progress
  FOR SELECT
  USING (
    student_phone IN (
      SELECT phone FROM students 
      WHERE id::text = auth.uid()::text
      OR id::text = current_setting('request.jwt.claims', true)::json->>'userId'
    )
  );

CREATE POLICY "Users can update own progress" ON exam_progress
  FOR ALL
  USING (
    student_phone IN (
      SELECT phone FROM students 
      WHERE id::text = auth.uid()::text
      OR id::text = current_setting('request.jwt.claims', true)::json->>'userId'
    )
  );

CREATE POLICY "Service role can manage progress" ON exam_progress
  FOR ALL
  USING (current_user = 'service_role');

-- ============================================
-- STEP 7: CREATE EMAIL VERIFICATION TABLE
-- ============================================

-- Create email verification codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on verification codes
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can manage verification codes
CREATE POLICY "Service role can manage verification codes" ON email_verification_codes
  FOR ALL
  USING (current_user = 'service_role');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_email ON email_verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_expires ON email_verification_codes(expires_at);

-- ============================================
-- STEP 8: VERIFICATION STATUS
-- ============================================

-- Ensure email_verified and is_verified columns exist
ALTER TABLE students 
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create index for admin panel queries
CREATE INDEX IF NOT EXISTS idx_students_verified ON students(is_verified, email_verified);

-- ============================================
-- VERIFICATION COMPLETE
-- ============================================

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('students', 'sessions', 'user_plans', 'exam_results', 'exam_progress', 'email_verification_codes')
ORDER BY tablename;

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
