# Admin Login Fix

## Problem
The admin login page uses Supabase Auth and checks for `role: 'admin'` in user metadata. The user created via backend API doesn't have this role.

## Solution Options

### Option 1: Use Regular Login (Recommended)
Since the admin user was created via the backend API, use the regular login page:

**Login URL**: http://localhost:8081/login

**Credentials**:
- Email: suleshw143@gmail.com
- Password: sulesh123456

This will work immediately!

### Option 2: Create Admin User in Supabase Dashboard
1. Go to Supabase Dashboard: https://app.supabase.com/
2. Select your project: dmlt-academy
3. Go to Authentication > Users
4. Click "Add User"
5. Fill in:
   - Email: suleshw143@gmail.com
   - Password: sulesh123456
   - Confirm email: Yes
6. After creating, click on the user
7. Go to "Raw User Meta Data"
8. Add:
   ```json
   {
     "name": "Admin",
     "role": "admin"
   }
   ```
9. Go to "Raw App Meta Data"
10. Add:
    ```json
    {
      "role": "admin"
    }
    ```
11. Save

Now you can login at: http://localhost:8081/admin/login

### Option 3: Update AdminAuthContext to Use Backend API
Modify `src/admin/context/AdminAuthContext.tsx` to also accept backend API authentication.

## Quick Fix: Use Regular Login

The easiest solution is to use the regular login page since your admin account is already created and working:

1. Go to: http://localhost:8081/login
2. Enter: suleshw143@gmail.com
3. Password: sulesh123456
4. Click "Sign In"

You'll be logged in successfully!

## Why This Happened

Your application has two authentication systems:
1. **Backend API Auth** (Node.js/Express with JWT) - Used by regular login
2. **Supabase Auth** - Used by admin login

The admin user was created in system #1 but admin login expects system #2.

## Recommendation

For simplicity, use the regular login page. If you need a separate admin panel, you can:
1. Add an `is_admin` field to the students table
2. Check this field after login
3. Redirect admins to admin dashboard

Or keep both systems and create admin users through Supabase Dashboard.
