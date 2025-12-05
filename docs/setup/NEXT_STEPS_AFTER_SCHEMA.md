# Next Steps After Schema Setup

Congratulations! Your database schema has been successfully created. Here's what to do next:

## ✅ Step 1: Verify Tables Were Created

Run this query in Supabase SQL Editor to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see these 12 tables:
- admins
- exam_progress
- exam_results
- otp_verifications
- plan_discounts
- plan_templates
- questions
- question_sets
- students
- subject_pricing
- subjects
- user_plans

## ✅ Step 2: Test Database Connection

1. **Start your frontend server:**
   ```bash
   npm run dev
   ```

2. **Try signing up a new user:**
   - Go to `/signup`
   - Create a test account
   - Check Supabase Dashboard → Table Editor → `students` table
   - You should see the new student record

## ✅ Step 3: Set Up Initial Data

### 3.1 Create Subjects

Run this in Supabase SQL Editor to create the 5 subjects:

```sql
INSERT INTO subjects (name, description) VALUES
  ('Mathematics', 'Mathematical reasoning and problem solving'),
  ('Physics', 'Physics concepts and applications'),
  ('Chemistry', 'Chemistry principles and reactions'),
  ('Biology', 'Biological sciences and life processes'),
  ('General Knowledge', 'Current affairs and general awareness')
ON CONFLICT (name) DO NOTHING;
```

### 3.2 Create Admin User (Optional)

If you want to use the admin panel, you'll need to:

1. **Sign up a user** through your app (or Supabase Auth)
2. **Add them to admins table:**

```sql
-- Replace 'admin@example.com' with your admin email
INSERT INTO admins (email, name, auth_user_id)
SELECT 
  'admin@example.com',
  'Admin User',
  id
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (email) DO NOTHING;
```

### 3.3 Create Sample Plan Templates (Optional)

```sql
INSERT INTO plan_templates (name, description, price, validity_days, subjects, display_order, badge, is_active)
VALUES
  ('Basic Plan', 'Access to 2 subjects for 30 days', 499.00, 30, '[]'::jsonb, 1, 'POPULAR', true),
  ('Premium Plan', 'Access to all subjects for 90 days', 999.00, 90, '[]'::jsonb, 2, 'BEST VALUE', true),
  ('Lifetime Access', 'One-time payment for lifetime access', 2999.00, NULL, '[]'::jsonb, 3, NULL, true)
ON CONFLICT DO NOTHING;
```

## ✅ Step 4: Configure Your Application

### 4.1 Verify Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8080
VITE_OTP_API_URL=http://localhost:5000
```

### 4.2 Start Backend Server (if using)

```bash
cd backend
npm install
npm run dev
```

### 4.3 Start OTP Server (if using custom OTP)

```bash
cd "src/pages/otp api"
npm install
node server.js
```

## ✅ Step 5: Test Core Features

### 5.1 Test User Signup
- [ ] Go to `/signup`
- [ ] Create a new account
- [ ] Verify user appears in `students` table

### 5.2 Test User Login
- [ ] Go to `/login`
- [ ] Login with your account
- [ ] Verify redirect to home page

### 5.3 Test Forgot Password
- [ ] Go to `/forgot-password`
- [ ] Enter your email
- [ ] Check email for OTP
- [ ] Verify OTP and reset password

### 5.4 Test Admin Panel (if set up)
- [ ] Go to `/admin/login`
- [ ] Login with admin account
- [ ] Verify you can access admin dashboard

## ✅ Step 6: Add Questions (Admin Panel)

Once admin is set up:

1. **Go to Admin Panel** → Subjects
2. **Select a subject** (e.g., Mathematics)
3. **Create question sets** (5 sets per subject)
4. **Add questions** to each set (20 questions per set)

Or use bulk import:
- Go to Admin Panel → Bulk Import
- Upload questions via CSV/Excel

## ✅ Step 7: Test Exam Flow

1. **Login as student**
2. **Select a subject** from home page
3. **Choose a question set**
4. **Take the exam**
5. **Submit and view results**
6. **Check results in `exam_results` table**

## 🔧 Troubleshooting

### Tables Not Showing Up

**Solution**: Refresh Supabase Dashboard or run verification query again

### Can't Sign Up Users

**Check**:
- Supabase URL and Anon Key in `.env`
- RLS policies allow INSERT on `students` table
- Check browser console for errors

### Foreign Key Errors

**Solution**: Make sure you create subjects before creating question sets, and question sets before questions

### Admin Panel Not Working

**Check**:
- Admin user exists in `admins` table
- Admin user has `auth_user_id` set correctly
- RLS policies allow admin access

## 📚 Related Documentation

- [Environment Variables Setup](ENVIRONMENT_VARIABLES.md)
- [OTP API Setup](OTP_API_SETUP.md)
- [Admin Panel Setup](ADMIN_PANEL_SETUP.md)
- [Supabase Setup](SUPABASE_SETUP.md)

## 🎉 You're Ready!

Your database is set up and ready to use. Start adding content and testing your application!

