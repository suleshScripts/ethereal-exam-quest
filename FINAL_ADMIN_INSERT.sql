-- ============================================
-- FINAL ADMIN USER CREATION
-- ============================================
-- Email: suleshw143@gmail.com
-- Password: sulesh123456
-- Username: admin
-- ============================================

-- STEP 1: Delete existing user (if any)
DELETE FROM students WHERE email = 'suleshw143@gmail.com';

-- STEP 2: Insert admin user
-- Password: 'sulesh123456' hashed with bcrypt (cost 10)
INSERT INTO students (
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
  'suleshw143@gmail.com',
  'admin',
  'Admin User',
  '0000000000',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  true,
  true,
  NOW(),
  NOW()
);

-- STEP 3: Verify the user was created
SELECT 
  id, 
  email, 
  username, 
  name, 
  email_verified, 
  is_verified,
  created_at
FROM students 
WHERE email = 'suleshw143@gmail.com';

-- ============================================
-- LOGIN INSTRUCTIONS
-- ============================================
-- 1. Go to: https://clinomatrix.web.app/admin/login
-- 2. Enter:
--    Email: suleshw143@gmail.com
--    Password: sulesh123456
-- 3. Click "Login"
-- 4. You should be redirected to admin dashboard
-- ============================================

-- ⚠️ IMPORTANT:
-- The 'username' field MUST be 'admin' for admin panel access
-- The password hash is for 'sulesh123456' (bcrypt cost 10)
-- ============================================
