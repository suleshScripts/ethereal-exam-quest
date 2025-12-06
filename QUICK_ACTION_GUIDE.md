# ⚡ Quick Action Guide - Fix Security Issues NOW

## 🚨 DO THIS FIRST (5 minutes)

### Step 1: Fix Database Security (CRITICAL!)

1. **Open Supabase:**
   https://supabase.com/dashboard/project/ftssqrpnqwwuuskphgnz/sql/new

2. **Copy and Run:**
   - Open file: `SECURITY_FIXES.sql`
   - Select ALL (Ctrl+A)
   - Copy (Ctrl+C)
   - Paste in Supabase SQL Editor
   - Click **Run** (or Ctrl+Enter)

3. **Wait for success message**

✅ **Done! Your database is now secure.**

---

## 🧪 Test RLS is Working

Run this in Supabase SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'sessions', 'user_plans', 'exam_results', 'exam_progress');
```

**All should show `rowsecurity = true`**

---

## 🚀 Deploy Changes (10 minutes)

### Backend (Render)

**Option A: Auto-deploy (when you push to GitHub)**
- Changes will auto-deploy
- Wait 2-3 minutes

**Option B: Manual deploy**
1. Go to: https://dashboard.render.com/
2. Click: **dmlt-academy-backend**
3. Click: **Manual Deploy** → **Deploy latest commit**

### Frontend (Firebase)

```bash
npm run build
firebase deploy --only hosting
```

---

## ✅ Test Everything

### Test 1: RLS Protection (Burp Suite)

1. Open Burp Suite
2. Intercept Supabase request
3. Try to query all students
4. **Result:** Should only see your own data (or empty)

### Test 2: Email Verification

1. Go to: https://clinomatrix.web.app/signup
2. Create new account
3. **Verification modal should appear**
4. Check email for 6-digit code
5. Enter code
6. **Should say "Email Verified!"**

### Test 3: Admin Panel

1. Login as admin
2. Go to users list
3. **Should see verification status** (✅ or ❌)

---

## 📋 What Was Fixed

### 1. RLS (Row Level Security)
- **Before:** Anyone could see all users via Burp Suite
- **After:** Users can only see their own data

### 2. Email Verification
- **Before:** No verification, anyone could signup
- **After:** 6-digit code sent to email, must verify

### 3. Verification Status
- **Before:** Admin couldn't see who's verified
- **After:** Shows ✅ for verified, ❌ for unverified

---

## 🔧 Files Changed

### Backend:
- `backend/src/routes/verification.ts` (NEW)
- `backend/src/server.ts` (UPDATED)

### Frontend:
- `src/components/auth/EmailVerificationModal.tsx` (NEW)
- `src/pages/Signup.tsx` (UPDATED)

### Database:
- `SECURITY_FIXES.sql` (RUN THIS!)

---

## 🆘 If Something Breaks

### Backend not deploying?
- Check Render logs
- Verify all dependencies installed
- Check environment variables

### Verification email not sending?
- Check EMAIL_USER and EMAIL_PASS in Render
- Check backend logs
- Verify SMTP settings

### RLS blocking everything?
- Check you're using service_role key in backend
- Check policies are correct
- Verify backend is authenticated

---

## 📞 Quick Commands

### Check RLS Status:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### Manually Verify User:
```sql
UPDATE students SET email_verified = true, is_verified = true WHERE email = 'user@example.com';
```

### Check Verification Status:
```sql
SELECT email, email_verified, is_verified FROM students ORDER BY created_at DESC LIMIT 10;
```

---

## ✨ That's It!

**3 steps:**
1. Run SQL in Supabase (5 min)
2. Deploy backend and frontend (10 min)
3. Test everything (5 min)

**Total time: ~20 minutes**

**Your app is now secure! 🔒**
