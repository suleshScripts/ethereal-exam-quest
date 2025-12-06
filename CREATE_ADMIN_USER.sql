-- Create Admin User for /admin/login
-- Email: suleshw143@gmail.com
-- Password: sulesh123456
-- Username: admin (required for admin detection)

-- First, check if user already exists
DO $$
BEGIN
  -- Delete existing admin user if exists (to avoid duplicates)
  DELETE FROM students WHERE email = 'suleshw143@gmail.com';
  
  -- Insert new admin user
  -- Password hash for 'sulesh123456' using bcrypt (cost factor 10)
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
    'admin',  -- IMPORTANT: username must be 'admin' for admin detection
    'Admin User',
    '0000000000',  -- Placeholder phone number
    '$2a$10$YourBcryptHashWillGoHere',  -- This will be replaced below
    true,
    true,
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Admin user created successfully!';
END $$;

-- ⚠️ IMPORTANT: The password hash above is a placeholder.
-- You need to generate the actual bcrypt hash for 'sulesh123456'

-- To generate the correct hash, run this in Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('sulesh123456', 10);
-- console.log(hash);

-- OR use the script below to create the admin user via backend API
