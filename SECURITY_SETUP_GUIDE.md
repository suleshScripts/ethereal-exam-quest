# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Secrets Have Been Exposed

**ALL SECRETS IN THIS REPOSITORY HAVE BEEN COMMITTED TO GIT AND MUST BE ROTATED IMMEDIATELY**

This includes:
- Supabase Service Role Key
- Razorpay API Keys
- Email/SMTP Passwords
- JWT Secrets

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. Rotate Supabase Keys

1. Go to: https://supabase.com/dashboard/project/ftssqrpnqwwuuskphgnz/settings/api
2. Click "Reset" on Service Role Key
3. Copy the new key
4. Update in:
   - Render Dashboard environment variables
   - Local `.env` files (DO NOT COMMIT)

### 2. Rotate Razorpay Keys

1. Go to: https://dashboard.razorpay.com/app/keys
2. Regenerate API keys
3. Copy new Key ID and Secret
4. Update in:
   - Render Dashboard environment variables
   - Local `.env` files (DO NOT COMMIT)

### 3. Change Email Password

1. Go to: https://myaccount.google.com/apppasswords
2. Revoke old app password
3. Generate new app password
4. Update in:
   - Render Dashboard environment variables
   - Local `.env` files (DO NOT COMMIT)

### 4. Generate New JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update in:
- Render Dashboard environment variables
- Local `.env` files (DO NOT COMMIT)

---

## 🔐 Row Level Security (RLS) Setup

### Problem: Data Leak via Burp Suite

Currently, anyone can query:
```
GET /rest/v1/students?select=*
```

And see ALL users in the database.

### Solution: Enable RLS

Run this SQL in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_progress ENABLE ROW LEVEL SECURITY;

-- Students table policies
DROP POLICY IF EXISTS "Users can view own profile" ON students;
DROP POLICY IF EXISTS "Users can update own profile" ON students;
DROP POLICY IF EXISTS "Service role full access" ON students;
DROP POLICY IF EXISTS "Allow public signup" ON students;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON students
  FOR SELECT
  USING (
    auth.uid()::text = id::text
  );

-- Users can only update their own data
CREATE POLICY "Users can update own profile" ON students
  FOR UPDATE
  USING (
    auth.uid()::text = id::text
  );

-- Backend (service role) has full access
CREATE POLICY "Service role full access" ON students
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow public signup (INSERT only)
CREATE POLICY "Allow public signup" ON students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sessions table policies
DROP POLICY IF EXISTS "Users can view own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON sessions;
DROP POLICY IF EXISTS "Service role full access sessions" ON sessions;

CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT
  USING (
    auth.uid()::text = user_id::text
  );

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE
  USING (
    auth.uid()::text = user_id::text
  );

CREATE POLICY "Service role full access sessions" ON sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- User plans policies
DROP POLICY IF EXISTS "Users can view own plans" ON user_plans;
DROP POLICY IF EXISTS "Service role full access plans" ON user_plans;

CREATE POLICY "Users can view own plans" ON user_plans
  FOR SELECT
  USING (
    student_phone IN (
      SELECT phone FROM students WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role full access plans" ON user_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Exam results policies
DROP POLICY IF EXISTS "Users can view own results" ON exam_results;
DROP POLICY IF EXISTS "Users can insert own results" ON exam_results;
DROP POLICY IF EXISTS "Service role full access results" ON exam_results;

CREATE POLICY "Users can view own results" ON exam_results
  FOR SELECT
  USING (
    student_phone IN (
      SELECT phone FROM students WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own results" ON exam_results
  FOR INSERT
  WITH CHECK (
    student_phone IN (
      SELECT phone FROM students WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role full access results" ON exam_results
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Exam progress policies
DROP POLICY IF EXISTS "Users can manage own progress" ON exam_progress;
DROP POLICY IF EXISTS "Service role full access progress" ON exam_progress;

CREATE POLICY "Users can manage own progress" ON exam_progress
  FOR ALL
  USING (
    student_phone IN (
      SELECT phone FROM students WHERE id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    student_phone IN (
      SELECT phone FROM students WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role full access progress" ON exam_progress
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### Verify RLS is Working

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'sessions', 'user_plans', 'exam_results', 'exam_progress');

-- All should show rowsecurity = true
```

### Test with Burp Suite

After enabling RLS:
1. Intercept request to `/rest/v1/students?select=*`
2. Should only return current user's data (or empty if not authenticated)
3. Cannot see other users' data

---

## 📋 Environment Variables Setup

### Render Dashboard

1. Go to: https://dashboard.render.com/
2. Click on your service
3. Go to Environment tab
4. Add these variables (with your NEW rotated secrets):

```
NODE_ENV=production
PORT=8080
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_new_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_new_service_role_key>
JWT_SECRET=<your_new_generated_secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d
EMAIL_USER=<your_email>
EMAIL_PASS=<your_new_app_password>
RAZORPAY_KEY_ID=<your_new_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_new_razorpay_secret>
ALLOWED_ORIGINS=https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

### Local Development

1. Copy `.env.example` to `.env`
2. Fill in with your development credentials
3. **NEVER commit `.env` to git**

---

## ✅ Security Checklist

- [ ] Rotated Supabase Service Role Key
- [ ] Rotated Razorpay API Keys
- [ ] Changed Email App Password
- [ ] Generated new JWT Secret
- [ ] Updated all secrets in Render Dashboard
- [ ] Enabled RLS on all tables in Supabase
- [ ] Verified RLS with Burp Suite test
- [ ] Removed all hardcoded secrets from codebase
- [ ] Updated `.gitignore` to prevent future leaks
- [ ] Tested application still works after changes

---

## 🔍 How to Verify Security

### 1. Test RLS Protection

```bash
# Try to query all students (should fail or return only your data)
curl -X GET 'https://ftssqrpnqwwuuskphgnz.supabase.co/rest/v1/students?select=*' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_USER_TOKEN'
```

### 2. Test Authentication

```bash
# Test login
curl -X POST 'https://dmlt-academy-backend.onrender.com/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"test@example.com","password":"testpass"}'
```

### 3. Test Payment System

```bash
# Test payment order creation (requires auth token)
curl -X POST 'https://dmlt-academy-backend.onrender.com/api/payment/create-order' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{"amount":100,"planId":"test","planName":"Test"}'
```

---

## 📞 Support

If you need help:
1. Check Render logs for errors
2. Check Supabase logs for RLS violations
3. Verify all environment variables are set correctly

---

## ⚠️ REMEMBER

**NEVER commit secrets to git again!**

Always use:
- Environment variables
- Render Dashboard for production
- `.env` files for local (in `.gitignore`)
