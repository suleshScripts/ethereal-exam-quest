# Backend Setup Instructions

## ⚠️ IMPORTANT: Run Database Migration First

Before the signup feature will work, you need to create the `sessions` table in Supabase.

### Option 1: Run SQL in Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `RUN_THIS_MIGRATION.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see success messages

### Option 2: Use Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## Verify Migration

After running the migration, verify it worked:

1. Go to **Table Editor** in Supabase
2. You should see a `sessions` table with these columns:
   - id (uuid)
   - user_id (uuid)
   - refresh_token (text)
   - user_agent (text)
   - ip_address (text)
   - created_at (timestamptz)
   - last_used_at (timestamptz)
   - session_id (uuid)
   - expires_at (timestamptz)

## Test Signup Flow

Once the migration is complete:

```bash
# Start the backend
npm start

# In another terminal, test signup
node test-signup-flow.js
```

## What's Fixed

✅ Signup now automatically sends verification email
✅ Email templates are consistent (same design for signup and password reset)
✅ Verification code is sent immediately after account creation
✅ Single-session system enforced (one device at a time)

## Email Configuration

Make sure these are set in your `.env`:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password
```

## Testing

1. Run `node test-signup-flow.js`
2. Check backend logs for the verification code
3. The code will be sent to the email (if SMTP is configured)
4. Use the code to verify the email via the frontend modal
