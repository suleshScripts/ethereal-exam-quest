# Environment Variables Setup Guide

This guide explains how to configure all environment variables for the DMLT Academy Exam Portal.

## 📁 File Structure

The project uses separate `.env` files for different components:

```
ethereal-exam-quest/
├── .env                    # Frontend environment variables (VITE_*)
├── .env.example            # Frontend template (commit this)
├── backend/
│   ├── .env                # Backend environment variables
│   └── .env.example        # Backend template (commit this)
└── src/pages/otp api/
    ├── .env                # OTP server environment variables
    └── .env.example        # OTP server template (commit this)
```

## 🚀 Quick Setup

### 1. Frontend Setup

```bash
# Copy template to actual .env file
cp .env.example .env

# Edit .env and fill in your values
# Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Copy template to actual .env file
cp .env.example .env

# Edit .env and fill in your values
# Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
```

### 3. OTP Server Setup

```bash
# Navigate to OTP API folder
cd "src/pages/otp api"

# Copy template to actual .env file
cp .env.example .env

# Edit .env and fill in your values
# Required: EMAIL_USER, EMAIL_PASS
```

## 🔐 How to Change Supabase Credentials

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**

### Step 2: Find Your Credentials

You'll see:
- **Project URL**: `https://xxxxx.supabase.co`
- **Project API keys**:
  - **anon public**: Public key (safe for frontend)
  - **service_role**: Secret key (backend only, NEVER expose!)

### Step 3: Update Frontend (.env)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Update Backend (backend/.env)

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Restart Servers

```bash
# Restart frontend
npm run dev

# Restart backend (in backend folder)
npm run dev
```

## 🔑 Database Password

The **database password** is different from API keys:

- **Set when creating project**: You set this when creating your Supabase project
- **Reset password**: Go to Settings → Database → Reset Database Password
- **Used for**: Direct database connections (psql, pgAdmin, etc.)
- **NOT used by**: Your application (uses API keys instead)

### When Do You Need the Database Password?

- Connecting via `psql` command line
- Using database management tools (pgAdmin, DBeaver, etc.)
- Running database migrations manually
- Direct SQL access outside of Supabase dashboard

### How to Reset Database Password

1. Go to Supabase Dashboard → Settings → Database
2. Click **Reset Database Password**
3. Enter new password and confirm
4. Save it securely (you won't see it again)

## 📋 Environment Variables Reference

### Frontend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous/public key |
| `VITE_API_URL` | ✅ Yes | Backend API URL |
| `VITE_OTP_API_URL` | ⚠️ Optional | OTP server URL (default: http://localhost:5000) |
| `VITE_EMAILJS_SERVICE_ID` | ⚠️ Optional | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | ⚠️ Optional | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | ⚠️ Optional | EmailJS public key |
| `VITE_RAZORPAY_KEY_ID` | ⚠️ Optional | Razorpay public key |

### Backend (backend/.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Supabase service role key (SECRET!) |
| `JWT_SECRET` | ✅ Yes | JWT signing secret (256-bit random string) |
| `JWT_ACCESS_EXPIRY` | ⚠️ Optional | Access token expiry (default: 15m) |
| `JWT_REFRESH_EXPIRY` | ⚠️ Optional | Refresh token expiry (default: 30d) |
| `RAZORPAY_KEY_ID` | ⚠️ Optional | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ⚠️ Optional | Razorpay secret key |
| `ALLOWED_ORIGINS` | ✅ Yes | Comma-separated CORS origins |
| `EMAIL_USER` | ⚠️ Optional | Gmail address for emails |
| `EMAIL_PASS` | ⚠️ Optional | Gmail app password |
| `PORT` | ⚠️ Optional | Server port (default: 8080) |
| `NODE_ENV` | ⚠️ Optional | Environment (development/production) |

### OTP Server (src/pages/otp api/.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_USER` | ✅ Yes | Gmail address for sending OTPs |
| `EMAIL_PASS` | ✅ Yes | Gmail app password |
| `PORT` | ⚠️ Optional | Server port (default: 5000) |
| `FRONTEND_URL` | ⚠️ Optional | Frontend URL for CORS |

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Only commit `.env.example`** - Templates without real values
3. **Service Role Key** - NEVER expose on frontend or commit to git
4. **JWT Secret** - Use a strong random string (256 bits)
5. **Rotate secrets** - Change keys periodically in production
6. **Use different keys** - Separate keys for development/production

## 🐛 Troubleshooting

### "Supabase URL and Anon Key are required"

**Problem**: Frontend can't connect to Supabase

**Solution**:
1. Check `.env` file exists in root directory
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Restart development server (`npm run dev`)

### "Failed to connect to backend"

**Problem**: Frontend can't reach backend API

**Solution**:
1. Check `VITE_API_URL` in `.env` matches backend URL
2. Verify backend is running (`cd backend && npm run dev`)
3. Check CORS settings in backend `.env` (`ALLOWED_ORIGINS`)

### "OTP not sending"

**Problem**: OTP server can't send emails

**Solution**:
1. Check `src/pages/otp api/.env` exists
2. Verify `EMAIL_USER` and `EMAIL_PASS` are correct
3. Ensure Gmail App Password is used (not regular password)
4. Check OTP server is running (`node server.js`)

### "Invalid API key"

**Problem**: Supabase API key is incorrect

**Solution**:
1. Go to Supabase Dashboard → Settings → API
2. Copy the correct key (anon for frontend, service_role for backend)
3. Update `.env` file
4. Restart server

## 📝 Notes

- **VITE_ prefix**: All frontend variables must start with `VITE_` for Vite to expose them
- **Hot reload**: Frontend env changes require server restart
- **Backend env**: Changes require backend server restart
- **Production**: Use environment variables from your hosting platform (Vercel, Netlify, etc.)

## 🔗 Related Documentation

- [Supabase Setup Guide](SUPABASE_SETUP.md)
- [OTP API Setup Guide](OTP_API_SETUP.md)
- [Backend Setup Guide](../backend/README.md)

