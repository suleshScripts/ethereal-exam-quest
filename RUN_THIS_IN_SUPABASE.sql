-- ============================================
-- 🚨 RUN THIS IN SUPABASE SQL EDITOR NOW
-- ============================================
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor
-- Copy this entire file and click "Run"
-- ============================================

-- Create sessions table with all required columns
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  refresh_token TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  session_id UUID DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if any
DROP POLICY IF EXISTS "Service role full access sessions" ON sessions;

-- Create service role policy (backend manages sessions)
CREATE POLICY "Service role full access sessions" ON sessions
  FOR ALL TO service_role
  USING (true);

-- Clear any existing sessions (fresh start)
TRUNCATE TABLE sessions;

-- Add unique constraint: ONE session per user (single-session system)
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_unique;
ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_unique UNIQUE (user_id);

-- Create cleanup function for expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO service_role;

-- ============================================
-- VERIFICATION (Check if everything worked)
-- ============================================

-- Check if table exists
SELECT 
  'Sessions table' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'sessions'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- Check if RLS is enabled
SELECT 
  'RLS enabled' as check_type,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables
WHERE tablename = 'sessions';

-- Check unique constraint
SELECT 
  'Unique constraint' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'sessions' 
    AND constraint_type = 'UNIQUE'
    AND constraint_name = 'sessions_user_id_unique'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ MIGRATION COMPLETE! ✅✅✅';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Sessions table created';
  RAISE NOTICE '✅ Indexes created';
  RAISE NOTICE '✅ RLS policies applied';
  RAISE NOTICE '✅ Single-session system enabled';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now test signup!';
  RAISE NOTICE '';
END $$;
