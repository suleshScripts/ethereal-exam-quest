# Custom OTP API Setup for Password Reset

This document explains how the custom OTP API server is integrated into the forgot password flow.

## Overview

The forgot password functionality now uses a custom OTP API server instead of EmailJS. The OTP server is located in `src/pages/otp api/` and handles sending and verifying OTP codes via email.

## Architecture

### Components

1. **OTP API Server** (`src/pages/otp api/server.js`)
   - Express.js server running on port 5000 (configurable via `PORT` env var)
   - Endpoints:
     - `POST /send-otp` - Sends OTP to email address
     - `POST /verify-otp` - Verifies OTP code
   - Uses nodemailer with Gmail SMTP
   - Stores OTPs in memory with bcrypt hashing
   - 5-minute expiry, 30-second cooldown between requests

2. **OTP API Service** (`src/lib/otpApiService.ts`)
   - Frontend service to communicate with OTP API
   - Functions:
     - `sendOTP(email, name?)` - Request OTP
     - `verifyOTP(email, otp)` - Verify OTP code

3. **ForgotPassword Page** (`src/pages/ForgotPassword.tsx`)
   - Updated to use custom OTP API
   - Three-step flow:
     1. Enter email → Send OTP
     2. Enter OTP → Verify
     3. Enter new password → Reset

4. **AuthContext** (`src/context/AuthContext.tsx`)
   - Added `verifyOTP()` method
   - Added `resetPassword()` method

## Setup Instructions

### 1. Configure OTP Server Environment

Create a `.env` file in `src/pages/otp api/`:

```env
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Note:** For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password (not your regular password)
3. Use the App Password as `EMAIL_PASS`

### 2. Install OTP Server Dependencies

```bash
cd "src/pages/otp api"
npm install
```

### 3. Start OTP Server

```bash
cd "src/pages/otp api"
node server.js
```

The server will run on `http://localhost:5000` (or your configured PORT).

### 4. Configure Frontend Environment

Add to your main `.env` file (root directory):

```env
VITE_OTP_API_URL=http://localhost:5000
```

If not set, it defaults to `http://localhost:5000`.

### 5. Start Frontend

```bash
npm run dev
```

## Usage Flow

1. User navigates to `/forgot-password`
2. User enters email address
3. Frontend calls `sendOTP(email, name)` → OTP server sends email
4. User enters OTP code
5. Frontend calls `verifyOTP(email, otp)` → OTP server verifies
6. User enters new password
7. Frontend calls `resetPassword(email, password)` → Updates database

## API Endpoints

### POST /send-otp

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email."
}
```

**Errors:**
- `400` - Email required
- `429` - Rate limit (wait 30 seconds)
- `500` - Server error

### POST /verify-otp

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully."
}
```

**Errors:**
- `400` - Email and OTP required, OTP already used, OTP expired, Invalid OTP
- `404` - No OTP found for email
- `500` - Server error

## Security Features

- ✅ OTPs are bcrypt hashed before storage
- ✅ OTPs expire after 5 minutes
- ✅ OTPs can only be used once
- ✅ Rate limiting (30 seconds between requests)
- ✅ CORS enabled for frontend communication

## Troubleshooting

### OTP Server Won't Start

- Check that `EMAIL_USER` and `EMAIL_PASS` are set in `.env`
- Verify Gmail App Password is correct
- Check port 5000 is not already in use

### OTP Not Received

- Check spam folder
- Verify email address is correct
- Check server logs for errors
- Verify Gmail SMTP settings

### CORS Errors

- Ensure `FRONTEND_URL` in OTP server `.env` matches your frontend URL
- Or set `FRONTEND_URL=*` for development (not recommended for production)

### OTP Verification Fails

- Ensure OTP is entered within 5 minutes
- Check that OTP hasn't been used already
- Verify email matches the one used to request OTP

## Production Deployment

For production:

1. **OTP Server:**
   - Deploy to a server (e.g., Heroku, Railway, DigitalOcean)
   - Set environment variables securely
   - Use a production email service (SendGrid, AWS SES, etc.)
   - Set `FRONTEND_URL` to your production frontend URL

2. **Frontend:**
   - Set `VITE_OTP_API_URL` to your production OTP server URL
   - Build and deploy frontend

3. **Security:**
   - Use HTTPS for both frontend and OTP server
   - Restrict CORS to specific origins
   - Consider using Redis/database for OTP storage instead of memory
   - Add rate limiting per IP address

## Files Modified

- ✅ `src/lib/otpApiService.ts` - New service file
- ✅ `src/context/AuthContext.tsx` - Added verifyOTP and resetPassword methods
- ✅ `src/pages/ForgotPassword.tsx` - Updated to use custom OTP API
- ✅ `src/pages/otp api/server.js` - Updated to accept name parameter

## Migration from EmailJS

The following EmailJS dependencies are no longer needed for password reset:
- `@emailjs/browser` (can be removed if not used elsewhere)
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

However, EmailJS may still be used for other features, so check before removing.

