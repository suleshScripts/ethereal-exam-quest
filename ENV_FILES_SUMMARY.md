# Environment Files Summary & Setup

## Current Status

You have multiple `.env` files that need to be organized:

1. ✅ **Root `.env`** - Frontend variables (exists)
2. ✅ **Root `.env.example`** - Frontend template (exists)
3. ✅ **Backend `.env.example`** - Backend template (exists)
4. ✅ **OTP API `.env`** - OTP server variables (exists)

## What You Need to Do

### Option 1: Keep Current Structure (Recommended)

Keep separate `.env` files for each component. This is the cleanest approach.

**Files to keep:**
- ✅ `.env` (root) - Frontend variables
- ✅ `.env.example` (root) - Frontend template
- ✅ `backend/.env` - Backend variables (create from `.env.example`)
- ✅ `backend/.env.example` - Backend template
- ✅ `src/pages/otp api/.env` - OTP server variables
- ✅ `src/pages/otp api/.env.example` - OTP server template (create this)

**Files to remove:**
- ❌ None - current structure is good!

### Option 2: Consolidate (Not Recommended)

You could put everything in root `.env`, but this is messy and confusing.

## How to Change Supabase Credentials

### Step-by-Step Guide

1. **Get Your Credentials**
   - Go to: https://app.supabase.com
   - Select your project
   - Go to: **Settings** → **API**

2. **Find These Values:**
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (SECRET!)

3. **Update Frontend** (`.env` in root):
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Update Backend** (`backend/.env`):
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

5. **Restart Servers:**
   ```bash
   # Frontend
   npm run dev
   
   # Backend (in backend folder)
   npm run dev
   ```

## Database Password vs API Keys

**Database Password:**
- Set when creating Supabase project
- Used for direct database connections (psql, pgAdmin)
- Reset in: Settings → Database → Reset Database Password
- **NOT used by your application**

**API Keys:**
- **anon public**: Safe for frontend (read-only with RLS)
- **service_role**: Backend only (full access, NEVER expose!)
- Found in: Settings → API

## Recommended File Structure

```
ethereal-exam-quest/
├── .env                    # ✅ Frontend variables (VITE_*)
├── .env.example            # ✅ Frontend template
├── backend/
│   ├── .env                # ✅ Backend variables (create from .env.example)
│   └── .env.example        # ✅ Backend template
└── src/pages/otp api/
    ├── .env                # ✅ OTP server variables
    └── .env.example        # ⚠️ Create this template
```

## Quick Setup Commands

```bash
# 1. Frontend - already exists, just update values
# Edit .env and update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 2. Backend - create .env from template
cd backend
cp .env.example .env
# Edit .env and update SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET

# 3. OTP API - already exists, just verify values
# Edit src/pages/otp api/.env if needed
```

## What Each File Contains

### Root `.env` (Frontend)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_URL` - Backend API URL
- `VITE_OTP_API_URL` - OTP server URL (optional)
- Other VITE_* variables

### Backend `.env`
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (SECRET!)
- `JWT_SECRET` - JWT signing secret
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` - Payment keys
- `ALLOWED_ORIGINS` - CORS configuration
- `EMAIL_USER` / `EMAIL_PASS` - Email credentials

### OTP API `.env`
- `EMAIL_USER` - Gmail address
- `EMAIL_PASS` - Gmail app password
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - CORS origin

## Security Notes

1. ✅ `.env` files are in `.gitignore` (not committed)
2. ✅ `.env.example` files are templates (safe to commit)
3. ⚠️ Never commit actual `.env` files with real values
4. ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` on frontend
5. ⚠️ Use different keys for development/production

## Need More Help?

See full documentation: [docs/setup/ENVIRONMENT_VARIABLES.md](docs/setup/ENVIRONMENT_VARIABLES.md)

