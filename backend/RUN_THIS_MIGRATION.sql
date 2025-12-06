-- ============================================
-- COMPLETE SESSIONS TABLE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create sessions table if it doesn't exist
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

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);

-- Step 3: Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies
DROP POLICY IF EXISTS "Service role full access sessions" ON sessions;

-- Step 5: Create service role policy
CREATE POLICY "Service role full access sessions" ON sessions
  FOR ALL TO service_role
  USING (true);

-- Step 6: Clear existing sessions
TRUNCATE TABLE sessions;

-- Step 7: Add unique constraint for single session per user
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_unique;
ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_unique UNIQUE (user_id);

-- Step 8: Create cleanup function
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

-- Step 9: Grant permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO service_role;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
  'Sessions table' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'sessions'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT 
  'RLS enabled' as check_type,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables
WHERE tablename = 'sessions';

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
  RAISE NOTICE '✅ Sessions table setup complete!';
  RAISE NOTICE '✅ Single-session system enabled';
  RAISE NOTICE '✅ Only ONE session per user allowed';
  RAISE NOTICE '';
END $$;
