# Single-Session System - Quick Reference

## 🎯 What It Does
Only **ONE active session** per user. Logging in on Device B automatically invalidates Device A.

## 🔑 Key Concepts

### Session Flow
```
User logs in → Delete old sessions → Create new session → Store session_id in JWT
```

### Validation Flow
```
Request arrives → Extract JWT → Verify signature → Query database → Check session_id matches → Allow/Deny
```

## 📁 Modified Files

| File | What Changed |
|------|-------------|
| `backend/src/utils/jwt.ts` | Added `sessionId` to tokens |
| `backend/src/middleware/auth.ts` | Validates session against database |
| `backend/src/routes/auth.ts` | Deletes old sessions on login |

## 🗄️ Database Changes

```sql
-- New columns
ALTER TABLE sessions ADD COLUMN session_id UUID;
ALTER TABLE sessions ADD COLUMN expires_at TIMESTAMPTZ;

-- Unique constraint (enforces single session)
ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_unique UNIQUE (user_id);
```

## 🧪 Quick Test

```bash
# Test the system
node backend/test-single-session.js
```

Expected: Device A gets 401 after Device B logs in.

## 🚀 Deploy

```bash
# 1. Apply migration in Supabase SQL Editor
# 2. Push code
git add .
git commit -m "Implement single-session system"
git push origin main
```

## 🔍 Monitor

```sql
-- Check active sessions
SELECT user_id, COUNT(*) FROM sessions GROUP BY user_id;
-- Each user should have exactly 1 session

-- Cleanup expired
SELECT cleanup_expired_sessions();
```

## ⚠️ Error Messages

| Error | Meaning |
|-------|---------|
| `Session invalid. You may have logged in from another device.` | User logged in elsewhere |
| `Session expired. Please login again.` | Session > 30 days old |

## 🔧 Environment Variables

No new variables needed! Uses existing:
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRY`
- `JWT_REFRESH_EXPIRY`

## 📚 Full Documentation

See `backend/SINGLE_SESSION_SYSTEM.md` for complete details.

## ✅ Verification

```bash
# 1. Login as user on Device A
curl -X POST https://dmlt-academy-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"test123"}'

# Save token as TOKEN_A

# 2. Test Device A works
curl -X GET https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer TOKEN_A"
# Should return 200 OK

# 3. Login as same user on Device B
curl -X POST https://dmlt-academy-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"test123"}'

# Save token as TOKEN_B

# 4. Test Device A again
curl -X GET https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer TOKEN_A"
# Should return 401 Unauthorized ✅

# 5. Test Device B works
curl -X GET https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer TOKEN_B"
# Should return 200 OK ✅
```

## 🎉 Success!

If Device A gets 401 after Device B logs in, the system is working correctly!
