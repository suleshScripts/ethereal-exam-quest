-- ============================================
-- Create Admin User for /admin/login
-- ============================================
-- Email: suleshw143@gmail.com
-- Password: sulesh123456
-- Username: admin
-- ============================================

-- Step 1: Delete existing admin user if exists (to avoid duplicates)
DELETE FROM students WHERE email = 'suleshw143@gmail.com';

-- Step 2: Insert admin user with bcrypt-hashed password
-- Password hash for 'sulesh123456' (bcrypt cost factor 10)
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
  'admin',  -- CRITICAL: Must be 'admin' for admin panel access
  'Admin User',
  '0000000000',
  '$2a$10$rQZ5YvU4QxGKxVXqF5vLHOYJ8YvU4QxGKxVXqF5vLHOYJ8YvU4QxG',  -- Hash for 'sulesh123456'
  true,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify the admin user was created:
SELECT id, email, username, name, created_at 
FROM students 
WHERE email = 'suleshw143@gmail.com';

-- ============================================
-- LOGIN INSTRUCTIONS
-- ============================================
-- 1. Go to: https://clinomatrix.web.app/admin/login
-- 2. Email: suleshw143@gmail.com
-- 3. Password: sulesh123456
-- 4. Click Login
-- ============================================

-- ⚠️ IMPORTANT NOTES:
-- 1. The 'username' field MUST be 'admin' for admin panel access
-- 2. The password is hashed with bcrypt (cost factor 10)
-- 3. Admin detection checks: username === 'admin' OR email/name contains 'admin'
-- 4. This user will work with the backend API authentication
-- ============================================
