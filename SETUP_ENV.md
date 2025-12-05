# Environment Variables Setup Instructions

## Quick Setup

### 1. Frontend Environment Variables

Create or update `.env` in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# OTP API Server (optional - defaults to http://localhost:5000)
VITE_OTP_API_URL=http://localhost:5000

# EmailJS (optional - for contact forms)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Razorpay Public Key (optional)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Backend Environment Variables

Create or update `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=8080

# Supabase (Backend Only - NEVER expose on frontend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your-256-bit-random-secret-string
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:5173,http://localhost:8080

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 3. OTP Server Environment Variables

Create or update `src/pages/otp api/.env`:

```env
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

## How to Change Supabase Credentials

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Navigate to**: Settings → API
4. **Copy the following**:
   - **Project URL** → Use for `VITE_SUPABASE_URL` (frontend) and `SUPABASE_URL` (backend)
   - **anon public key** → Use for `VITE_SUPABASE_ANON_KEY` (frontend)
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (backend)
5. **Update your .env files** with the new values
6. **Restart your servers**

## Database Password

The database password is different from API keys:
- **Set when**: Creating your Supabase project
- **Reset**: Settings → Database → Reset Database Password
- **Used for**: Direct database connections (psql, pgAdmin)
- **NOT used by**: Your application (uses API keys)

## See Full Documentation

For detailed information, see: [docs/setup/ENVIRONMENT_VARIABLES.md](docs/setup/ENVIRONMENT_VARIABLES.md)

