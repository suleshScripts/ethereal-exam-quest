# 🔐 Create Admin User - Complete Guide

## Admin Credentials
- **Email:** suleshw143@gmail.com
- **Password:** sulesh123456
- **Username:** admin (required for admin detection)

---

## ✅ Method 1: Using Backend API (RECOMMENDED)

This is the easiest and most reliable method.

### Step 1: Run the Script

```bash
node create-admin-via-api.mjs
```

**What it does:**
- Calls the backend `/api/auth/signup` endpoint
- Creates user with username 'admin'
- Password is automatically hashed with bcrypt
- Works with both local and production backend

### Step 2: Test Login

Go to: https://clinomatrix.web.app/admin/login
- Email: suleshw143@gmail.com
- Password: sulesh123456

---

## 📝 Method 2: Using Supabase SQL Editor

If the API method doesn't work, use this SQL directly in Supabase.

### Step 1: Generate Password Hash

First, you need to generate the bcrypt hash for 'sulesh123456'.

**Option A: Use Online Tool**
1. Go to: https://bcrypt-generator.com/
2. Enter password: `sulesh123456`
3. Rounds: `10`
4. Click "Generate"
5. Copy the hash (starts with `$2a$10$`)

**Option B: Use Node.js**
```bash
npm install bcryptjs
node -e "require('bcryptjs').hash('sulesh123456', 10).then(h => console.log(h))"
```

### Step 2: Run SQL in Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project: **ftssqrpnqwwuuskphgnz**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste this SQL (replace `YOUR_BCRYPT_HASH_HERE` with the hash from Step 1):

```sql
-- Delete existing admin user if exists
DELETE FROM students WHERE email = 'suleshw143@gmail.com';

-- Insert admin user
INSERT INTO students (
  id,
  email,
  username,
  name,
  phone,
  password_hash,
  email_verified,
  is_verified,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'suleshw143@gmail.com',
  'admin',
  'Admin User',
  '0000000000',
  'YOUR_BCRYPT_HASH_HERE',  -- Replace with actual hash
  true,
  true,
  NOW(),
  NOW()
);

-- Verify it was created
SELECT id, email, username, name, created_at 
FROM students 
WHERE email = 'suleshw143@gmail.com';
```

6. Click **Run** (or press Ctrl+Enter)
7. You should see the admin user in the results

---

## 🧪 Method 3: Using Existing Script

If you already have the admin user created before, just update the password:

```sql
-- Update admin user password
UPDATE students 
SET 
  username = 'admin',
  password_hash = 'YOUR_BCRYPT_HASH_HERE',
  email_verified = true,
  is_verified = true,
  updated_at = NOW()
WHERE email = 'suleshw143@gmail.com';

-- Verify
SELECT id, email, username, name 
FROM students 
WHERE email = 'suleshw143@gmail.com';
```

---

## ✅ Verification

After creating the admin user, verify it works:

### 1. Check Database
```sql
SELECT id, email, username, name, email_verified, is_verified
FROM students 
WHERE email = 'suleshw143@gmail.com';
```

Should return:
- email: `suleshw143@gmail.com`
- username: `admin` ← **CRITICAL**
- email_verified: `true`
- is_verified: `true`

### 2. Test Login

**Local:**
```
http://localhost:5173/admin/login
```

**Production:**
```
https://clinomatrix.web.app/admin/login
```

**Credentials:**
- Email: suleshw143@gmail.com
- Password: sulesh123456

### 3. Check Admin Detection

The admin login checks:
1. `username === 'admin'` ← **Primary check**
2. OR `email.includes('admin')`
3. OR `name.includes('admin')`

Your user has `username = 'admin'` so it will work!

---

## 🚨 Troubleshooting

### "Invalid credentials"
- Password hash might be wrong
- Try Method 1 (API) which auto-hashes the password

### "User does not have admin privileges"
- Check that `username` field is exactly `'admin'`
- Run this SQL to fix:
```sql
UPDATE students 
SET username = 'admin' 
WHERE email = 'suleshw143@gmail.com';
```

### "User not found"
- User doesn't exist in database
- Use Method 1 or Method 2 to create it

### Backend not responding
- Check if backend is running
- Local: http://localhost:8080/health
- Production: https://dmlt-academy-backend.onrender.com/health

---

## 📋 Quick Reference

| Field | Value |
|-------|-------|
| Email | suleshw143@gmail.com |
| Password | sulesh123456 |
| Username | admin |
| Name | Admin User |
| Phone | 0000000000 |
| Login URL (Local) | http://localhost:5173/admin/login |
| Login URL (Prod) | https://clinomatrix.web.app/admin/login |

---

## 🎯 Recommended Approach

1. **Try Method 1 first** (API script) - easiest and most reliable
2. If that fails, use **Method 2** (SQL with bcrypt hash)
3. If user exists, use **Method 3** (update password)

**Most people succeed with Method 1!** 🚀
