-- ============================================
-- SINGLE-SESSION LOGIN SYSTEM MIGRATION
-- Ensures only ONE active session per user at any time
-- ============================================

-- Step 1: Add session_id column to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid();

-- Step 2: Add expires_at column for session expiration
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days');

-- Step 3: Drop existing sessions to start fresh (clean slate)
TRUNCATE TABLE sessions;

-- Step 4: Add UNIQUE constraint on user_id to enforce single session per user
-- This ensures only ONE active session can exist per user
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_unique;
ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_unique UNIQUE (user_id);

-- Step 5: Create index on session_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);

-- Step 6: Update cleanup function to also remove expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete sessions that are expired
  DELETE FROM sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service_role
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO service_role;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check columns added
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'sessions' 
  AND column_name IN ('session_id', 'expires_at');

-- Check unique constraint
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'sessions' 
  AND constraint_type = 'UNIQUE';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Single-session system migration completed!';
  RAISE NOTICE '✅ session_id column added';
  RAISE NOTICE '✅ expires_at column added';
  RAISE NOTICE '✅ UNIQUE constraint on user_id enforced';
  RAISE NOTICE '✅ Only ONE session per user allowed';
  RAISE NOTICE '';
  RAISE NOTICE '📝 When user logs in on Device B:';
  RAISE NOTICE '   - Old session (Device A) will be deleted';
  RAISE NOTICE '   - New session (Device B) will be created';
  RAISE NOTICE '   - Device A will get 401 on next request';
  RAISE NOTICE '';
END $$;
