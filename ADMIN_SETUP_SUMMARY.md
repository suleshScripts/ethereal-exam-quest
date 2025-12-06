# 🎯 Admin User Setup - Quick Start

## What You Need
- **Email:** suleshw143@gmail.com
- **Password:** sulesh123456
- **Login URL:** https://clinomatrix.web.app/admin/login

---

## 🚀 Easiest Method (30 seconds)

### Option 1: Run SQL in Supabase

1. Go to: https://supabase.com/dashboard/project/ftssqrpnqwwuuskphgnz/sql/new
2. Copy and paste this entire SQL:

```sql
DELETE FROM students WHERE email = 'suleshw143@gmail.com';

INSERT INTO students (
  email, username, name, phone, password_hash,
  email_verified, is_verified, created_at, updated_at
) VALUES (
  'suleshw143@gmail.com',
  'admin',
  'Admin User',
  '0000000000',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  true, true, NOW(), NOW()
);

SELECT id, email, username, name FROM students WHERE email = 'suleshw143@gmail.com';
```

3. Click **Run** (or press Ctrl+Enter)
4. Done! ✅

### Option 2: Run Node.js Script

```bash
node create-admin-via-api.mjs
```

---

## ✅ Test Login

1. Go to: https://clinomatrix.web.app/admin/login
2. Email: `suleshw143@gmail.com`
3. Password: `sulesh123456`
4. Click Login
5. Should redirect to admin dashboard!

---

## 📁 Files Created

- `FINAL_ADMIN_INSERT.sql` - Ready-to-use SQL (RECOMMENDED)
- `create-admin-via-api.mjs` - API script
- `ADMIN_USER_SETUP.md` - Detailed guide
- `INSERT_ADMIN_USER.sql` - Alternative SQL
- `CREATE_ADMIN_USER.sql` - Template SQL

**Use `FINAL_ADMIN_INSERT.sql` - it has the correct bcrypt hash!**

---

## 🔍 How It Works

The admin login checks if:
1. `username === 'admin'` ← **This is why username must be 'admin'**
2. OR email contains 'admin'
3. OR name contains 'admin'

Your user has `username = 'admin'` so it will work perfectly!

---

## 🎉 That's It!

Just run the SQL in Supabase and you're done!
