# Single-Session System - Deployment Checklist

## 🎯 Pre-Deployment Verification

### ✅ Code Changes Complete
- [x] JWT utils updated with sessionId
- [x] Auth middleware validates sessions against database
- [x] Login endpoint deletes old sessions before creating new one
- [x] Signup endpoint creates session with sessionId
- [x] Refresh endpoint validates session exists
- [x] Logout endpoint deletes session by sessionId
- [x] No TypeScript errors
- [x] No breaking changes to API endpoints

### ✅ Documentation Complete
- [x] `backend/SINGLE_SESSION_SYSTEM.md` - Full documentation
- [x] `backend/migrations/002_single_session_system.sql` - Database migration
- [x] `backend/test-single-session.js` - Test script
- [x] `SINGLE_SESSION_IMPLEMENTATION_SUMMARY.md` - Implementation summary
- [x] `DEPLOYMENT_CHECKLIST.md` - This checklist

## 📋 Deployment Steps

### Step 1: Apply Database Migration ⚠️ CRITICAL
**Must be done BEFORE deploying code!**

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `backend/migrations/002_single_session_system.sql`
4. Paste and execute
5. Verify success messages:
   - ✅ session_id column added
   - ✅ expires_at column added
   - ✅ UNIQUE constraint on user_id enforced
   - ✅ Indexes created

**Verification Query:**
```sql
-- Should show session_id and expires_at columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessions';

-- Should show unique constraint on user_id
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'sessions' AND constraint_type = 'UNIQUE';
```

### Step 2: Commit and Push Code

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Implement single-session login system

- Only ONE active session per user enforced
- Database-backed session validation
- Auto-invalidation when logging in elsewhere
- Session expiration after 30 days
- Comprehensive testing and documentation"

# Push to GitHub (triggers Render auto-deploy)
git push origin main
```

### Step 3: Monitor Render Deployment

1. Go to Render Dashboard: https://dashboard.render.com
2. Select `dmlt-academy-backend` service
3. Watch deployment logs
4. Wait for "Build successful" and "Deploy live"
5. Check health endpoint: https://dmlt-academy-backend.onrender.com/health

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T..."
}
```

### Step 4: Run Test Script

```bash
# Test against production
node backend/test-single-session.js
```

**Expected Output:**
```
=============================================================
🧪 SINGLE-SESSION LOGIN SYSTEM TEST
=============================================================

📱 STEP 1: Login on Device A
🔐 [Device A] Attempting login...
✅ [Device A] Login successful

📱 STEP 2: Verify Device A session works
🔍 [Device A] Testing authentication...
✅ [Device A] Auth successful - Session is VALID

📱 STEP 3: Login on Device B (same user)
🔐 [Device B] Attempting login...
✅ [Device B] Login successful

📱 STEP 4: Verify Device A session is now INVALID
🔍 [Device A] Testing authentication...
❌ [Device A] Auth failed - Session is INVALID
   Error: Session invalid. You may have logged in from another device.

📱 STEP 5: Verify Device B session is VALID
🔍 [Device B] Testing authentication...
✅ [Device B] Auth successful - Session is VALID

=============================================================
✅ TEST PASSED: Single-session system working correctly!
=============================================================
```

### Step 5: Manual Testing (Optional)

#### Test 1: Login on Browser A
1. Open Chrome (Device A)
2. Go to https://clinomatrix.web.app
3. Login with test account
4. Navigate to dashboard
5. ✅ Should work normally

#### Test 2: Login on Browser B
1. Open Firefox (Device B)
2. Go to https://clinomatrix.web.app
3. Login with SAME account
4. Navigate to dashboard
5. ✅ Should work normally

#### Test 3: Verify Browser A is Logged Out
1. Go back to Chrome (Device A)
2. Try to navigate or refresh
3. ❌ Should get 401 error or be redirected to login
4. ✅ This confirms single-session is working!

### Step 6: Monitor Active Sessions

Run in Supabase SQL Editor:
```sql
-- Check active sessions
SELECT 
  s.user_id,
  st.email,
  s.session_id,
  s.created_at,
  s.last_used_at,
  s.expires_at,
  s.user_agent
FROM sessions s
JOIN students st ON s.user_id = st.id
ORDER BY s.last_used_at DESC
LIMIT 20;

-- Verify only ONE session per user
SELECT 
  user_id,
  COUNT(*) as session_count
FROM sessions
GROUP BY user_id
HAVING COUNT(*) > 1;
-- Should return 0 rows!
```

## 🚨 Rollback Plan (If Issues Occur)

### Option 1: Quick Fix (Keep Code, Remove Constraint)
```sql
-- Remove unique constraint temporarily
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_unique;
```

This allows multiple sessions while you investigate issues.

### Option 2: Full Rollback (Revert Code)
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

Then remove migration changes:
```sql
-- Remove added columns
ALTER TABLE sessions DROP COLUMN IF EXISTS session_id;
ALTER TABLE sessions DROP COLUMN IF EXISTS expires_at;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_unique;
```

## 📊 Post-Deployment Monitoring

### Day 1: Check for Issues
- Monitor error logs in Render
- Check for 401 errors in frontend
- Verify users can login successfully
- Check session count per user (should be 1)

### Week 1: Performance Check
- Monitor database query performance
- Check session table size
- Run cleanup function: `SELECT cleanup_expired_sessions();`

### Month 1: Security Audit
- Review session logs
- Check for suspicious activity
- Verify no users have multiple sessions

## ✅ Success Criteria

Deployment is successful when:
- [x] Database migration applied without errors
- [x] Backend deployed to Render successfully
- [x] Health endpoint returns 200 OK
- [x] Test script passes all checks
- [x] Users can login normally
- [x] Logging in on Device B invalidates Device A
- [x] No errors in Render logs
- [x] Each user has exactly ONE session in database

## 📞 Support

If issues occur:
1. Check Render logs for errors
2. Check Supabase logs for database errors
3. Run verification queries in SQL Editor
4. Review `backend/SINGLE_SESSION_SYSTEM.md` for troubleshooting
5. Use rollback plan if critical issues

## 🎉 Completion

Once all steps are complete and verified:
- ✅ Single-session system is LIVE
- ✅ Users are protected from session hijacking
- ✅ Only ONE active session per user enforced
- ✅ System is production-ready

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Status:** ⬜ Pending / ⬜ In Progress / ⬜ Complete  
**Issues:** _____________
