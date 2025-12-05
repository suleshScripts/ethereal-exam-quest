-- ============================================
-- CREATE SESSIONS TABLE FOR DEVICE-BASED SESSION MANAGEMENT
-- Fixed to work with students table instead of auth.users
-- ============================================

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References students.id
  refresh_token TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Service role only (backend manages sessions)
DROP POLICY IF EXISTS "Service role full access sessions" ON sessions;
CREATE POLICY "Service role full access sessions" ON sessions
  FOR ALL TO service_role
  USING (true);

-- ============================================
-- CLEANUP FUNCTION FOR OLD SESSIONS
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete sessions older than 30 days
  DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service_role
GRANT EXECUTE ON FUNCTION cleanup_old_sessions() TO service_role;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check table created
SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS ON' ELSE '❌ RLS OFF' END as rls_status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'sessions';

-- Check policies
SELECT 
  tablename,
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE tablename = 'sessions';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Sessions table created successfully!';
  RAISE NOTICE '✅ Indexes created for performance';
  RAISE NOTICE '✅ RLS policies applied';
  RAISE NOTICE '✅ Cleanup function created';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Run this script in Supabase SQL Editor';
  RAISE NOTICE '📝 Sessions will be used for device tracking and logout-all feature';
  RAISE NOTICE '';
END $$;
