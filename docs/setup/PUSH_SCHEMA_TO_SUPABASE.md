# How to Push Schema to Supabase

This guide explains how to push the database schema to your Supabase project.

## Prerequisites

- ✅ Supabase project created
- ✅ Supabase URL and Anon Key added to `.env` file
- ✅ Access to Supabase Dashboard

## Method 1: Using Supabase SQL Editor (Recommended)

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Paste Schema

1. Open the file: `migrations/COMPLETE_SCHEMA.sql`
2. Copy the entire contents (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor

### Step 3: Review the Schema

The schema includes:
- ✅ Students table (with email/auth support)
- ✅ Exam results table
- ✅ Exam progress table
- ✅ User plans table
- ✅ Admin panel tables (subjects, question_sets, questions, admins)
- ✅ Pricing tables (plan_templates, subject_pricing, plan_discounts)
- ✅ Indexes for performance
- ✅ RLS policies for security
- ✅ Triggers for auto-updates

### Step 4: Execute the Schema

1. Click **Run** button (or press `Ctrl+Enter`)
2. Wait for execution to complete
3. Check for any errors in the output

### Step 5: Verify Tables Were Created

Run this query in SQL Editor to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see:
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

## Method 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Troubleshooting

### Error: "relation already exists"

**Problem**: Tables already exist in your database

**Solution**: 
1. Option A: Drop existing tables first (uncomment DROP statements in schema)
2. Option B: Use migration files instead of complete schema
3. Option C: Manually drop tables in Supabase Dashboard → Table Editor

### Error: "permission denied"

**Problem**: Insufficient permissions

**Solution**:
1. Make sure you're using the SQL Editor (not API)
2. Check you're logged in as project owner
3. Try running as service_role (Settings → API → service_role key)

### Error: "extension uuid-ossp does not exist"

**Solution**: This is already handled in the schema with `CREATE EXTENSION IF NOT EXISTS`

### Tables Created But No Data

**This is normal!** The schema only creates the structure. You'll add data through:
- User signups (creates student records)
- Admin panel (creates subjects, questions, etc.)
- Application usage (creates exam results, progress, etc.)

## Next Steps

After pushing the schema:

1. ✅ **Test Connection**: Try signing up a new user
2. ✅ **Create Admin User**: Use admin panel to create admin account
3. ✅ **Add Subjects**: Use admin panel to add subjects
4. ✅ **Add Questions**: Use admin panel to add questions
5. ✅ **Configure Plans**: Set up plan templates and pricing

## Related Files

- `migrations/COMPLETE_SCHEMA.sql` - Complete schema file
- `migrations/supabase-schema.sql` - Basic schema (older)
- `migrations/supabase-admin-panel-schema.sql` - Admin tables only
- `migrations/supabase-plan-pricing-schema.sql` - Pricing tables only

## Need Help?

If you encounter issues:
1. Check Supabase Dashboard → Logs for errors
2. Verify your `.env` file has correct Supabase credentials
3. Check that you have proper permissions in Supabase
4. Review the error message in SQL Editor output

