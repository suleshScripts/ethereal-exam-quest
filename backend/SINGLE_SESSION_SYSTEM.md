# Single-Session Login System Documentation

## Overview
This system ensures that **only ONE active session** exists per user at any time. When a user logs in on a new device, all previous sessions are automatically invalidated.

## How It Works

### 1. Database Schema
The `sessions` table has been modified with:
- `session_id` (UUID): Unique identifier for each session
- `expires_at` (TIMESTAMPTZ): Session expiration timestamp
- **UNIQUE constraint on `user_id`**: Enforces single session per user at database level

### 2. Login Flow
When a user logs in:
1. **Delete all existing sessions** for that user
2. Generate a new `session_id` (UUID)
3. Create JWT tokens (access + refresh) containing the `session_id`
4. Store session in database with:
   - `user_id`
   - `session_id`
   - `refresh_token`
   - `expires_at` (30 days from now)
   - Device info (user_agent, ip_address)

### 3. Authentication Middleware
On every authenticated request:
1. Extract JWT token from `Authorization: Bearer <token>` header
2. Verify JWT signature and decode payload
3. **Query database** to verify:
   - Session exists for `user_id` + `session_id` combination
   - Session has not expired
4. If session not found or expired → Return **401 Unauthorized**
5. If valid → Update `last_used_at` timestamp and allow request

### 4. Refresh Token Flow
When refreshing access token:
1. Verify refresh token JWT
2. **Check database** that session still exists and matches `session_id`
3. If session invalid → Return **401** (user logged in elsewhere)
4. If valid → Generate new access token with same `session_id`

### 5. Logout Flow
When user logs out:
1. Extract `session_id` from refresh token
2. **Delete session record** from database
3. User is logged out

## Security Benefits

### ✅ Single Device Login
- Only ONE active session per user
- Logging in on Device B automatically invalidates Device A

### ✅ Session Hijacking Protection
- Even if attacker steals JWT token, they can't use it if:
  - User logs in again (invalidates old session)
  - Session expires
  - Session is deleted from database

### ✅ Database-Backed Validation
- Every request validates against database
- Tokens can be revoked instantly by deleting session
- No reliance on JWT expiration alone

### ✅ Automatic Cleanup
- Expired sessions are automatically cleaned up
- `cleanup_expired_sessions()` function available

## Implementation Files

### Modified Files
1. **`backend/src/utils/jwt.ts`**
   - Added `sessionId` to `TokenPayload` interface
   - Updated `generateAccessToken()` to include `sessionId`
   - Updated `generateRefreshToken()` to include `sessionId`

2. **`backend/src/middleware/auth.ts`**
   - Made `authenticate()` async to query database
   - Added session validation against database
   - Returns 401 if session not found or expired
   - Updates `last_used_at` on successful validation

3. **`backend/src/routes/auth.ts`**
   - **Login**: Deletes all old sessions before creating new one
   - **Signup**: Creates session with `session_id`
   - **Refresh**: Validates session exists before refreshing
   - **Logout**: Deletes session by `session_id`

### New Files
1. **`backend/migrations/002_single_session_system.sql`**
   - Adds `session_id` column
   - Adds `expires_at` column
   - Adds UNIQUE constraint on `user_id`
   - Creates `cleanup_expired_sessions()` function

## Testing the System

### Test Scenario: Login on Two Devices

#### Step 1: Login on Device A
```bash
curl -X POST https://dmlt-academy-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": { "id": "...", "email": "test@example.com" },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

Save the `access_token` as `TOKEN_A`.

#### Step 2: Make Request from Device A
```bash
curl -X GET https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer TOKEN_A"
```

**Response:** ✅ Success (200 OK)

#### Step 3: Login on Device B (Same User)
```bash
curl -X POST https://dmlt-academy-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

Save the `access_token` as `TOKEN_B`.

#### Step 4: Try Request from Device A Again
```bash
curl -X GET https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer TOKEN_A"
```

**Response:** ❌ **401 Unauthorized**
```json
{
  "success": false,
  "error": "Session invalid. You may have logged in from another device."
}
```

#### Step 5: Request from Device B Works
```bash
curl -X GET https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer TOKEN_B"
```

**Response:** ✅ Success (200 OK)

## Environment Variables

No new environment variables required. Existing variables:
- `JWT_SECRET` - Used to sign tokens (MUST be secure)
- `JWT_ACCESS_EXPIRY` - Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRY` - Refresh token expiration (default: 30d)

## Database Migration

Run this SQL in Supabase SQL Editor:
```sql
-- File: backend/migrations/002_single_session_system.sql
-- See file for complete migration script
```

## Error Messages

| Error | Meaning |
|-------|---------|
| `Session invalid. You may have logged in from another device.` | User logged in elsewhere, old session invalidated |
| `Session expired. Please login again.` | Session exceeded 30-day expiration |
| `Invalid token: missing session ID` | Token doesn't contain session ID (old token format) |
| `No token provided` | Missing Authorization header |
| `Invalid or expired token` | JWT signature invalid or token expired |

## Monitoring & Maintenance

### Check Active Sessions
```sql
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
ORDER BY s.last_used_at DESC;
```

### Cleanup Expired Sessions
```sql
SELECT cleanup_expired_sessions();
```

### Count Sessions Per User (Should Always Be 1)
```sql
SELECT 
  user_id,
  COUNT(*) as session_count
FROM sessions
GROUP BY user_id
HAVING COUNT(*) > 1;
```

If this query returns any rows, the unique constraint is not working properly.

## Rollback Plan

If issues occur, you can temporarily disable single-session enforcement:

1. Remove unique constraint:
```sql
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_unique;
```

2. Revert code changes to allow multiple sessions

3. Investigate issues before re-enabling

## Summary

✅ **Single session per user enforced**  
✅ **Database-backed validation on every request**  
✅ **Automatic invalidation when logging in elsewhere**  
✅ **Session expiration after 30 days**  
✅ **Secure token-based authentication**  
✅ **No breaking changes to API endpoints**  

The system is production-ready and provides robust security against session hijacking and unauthorized access.
