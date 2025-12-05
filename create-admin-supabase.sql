-- SQL Script to create admin user in Supabase
-- Run this in Supabase SQL Editor

-- Step 1: Create auth user with admin role
-- Note: You need to do this via Supabase Dashboard or Admin API
-- This SQL is for reference only

-- Step 2: Update existing user to have admin role
-- If the user already exists in auth.users, update their metadata

UPDATE auth.users
SET 
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  ),
  raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
WHERE email = 'suleshw143@gmail.com';

-- Step 3: Verify the update
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as user_role,
  raw_app_meta_data->>'role' as app_role,
  created_at
FROM auth.users
WHERE email = 'suleshw143@gmail.com';

-- Step 4: If user doesn't exist in auth.users, you need to create via Supabase Admin API
-- Use the Supabase Dashboard: Authentication > Users > Add User
-- Or use this API call (replace with your service role key):

/*
POST https://ftssqrpnqwwuuskphgnz.supabase.co/auth/v1/admin/users
Headers:
  apikey: YOUR_SERVICE_ROLE_KEY
  Authorization: Bearer YOUR_SERVICE_ROLE_KEY
  Content-Type: application/json

Body:
{
  "email": "suleshw143@gmail.com",
  "password": "sulesh123456",
  "email_confirm": true,
  "user_metadata": {
    "name": "Admin",
    "role": "admin"
  },
  "app_metadata": {
    "role": "admin"
  }
}
*/
