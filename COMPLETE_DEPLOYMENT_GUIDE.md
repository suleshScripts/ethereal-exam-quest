# 🚀 Complete Deployment Guide

## Current Status
✅ Frontend deployed: https://clinomatrix.web.app
❌ Backend not deployed (still on localhost:8080)
❌ OTP not working (backend not accessible)
❌ Login/Signup not working (backend not accessible)

## Problem
Your frontend is live on Firebase, but it's trying to connect to `http://localhost:8080` which doesn't exist on the internet. We need to deploy the backend to a cloud service.

## Solution: Deploy Backend to Render.com (FREE)

### Step 1: Deploy Backend on Render

1. **Go to Render**: https://dashboard.render.com/
   - Sign up/Login with your GitHub account

2. **Create New Web Service**:
   - Click "New +" button → "Web Service"
   - Connect to GitHub repository: `suleshScripts/ethereal-exam-quest`
   - Click "Connect"

3. **Configure the Service**:
   ```
   Name: dmlt-academy-backend
   Region: Singapore
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables** (Click "Advanced"):
   Copy-paste each of these:
   ```
   NODE_ENV=production
   PORT=8080
   VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDI3NzgsImV4cCI6MjA4MDUxODc3OH0.5IEakfRUWyVwpeWkYO5G7ZJwTg0z5kebgZr2IPVWFks
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-256-bit-random-string
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=30d
   EMAIL_USER=suleshwaghmare2004@gmail.com
   EMAIL_PASS=zrxrnhxnhaflrcne
   RAZORPAY_KEY_ID=rzp_live_Rlz1BRY2tHLFgm
   RAZORPAY_KEY_SECRET=your_razorpay_secret_here
   ALLOWED_ORIGINS=https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
   ```

5. **Click "Create Web Service"**
   - Wait 5-10 minutes for deployment
   - Watch the logs to see progress

6. **Copy Your Backend URL**
   - After deployment, you'll see a URL like: `https://dmlt-academy-backend.onrender.com`
   - **COPY THIS URL** - you'll need it next!

### Step 2: Update Frontend with Backend URL

Once you have your backend URL, run this command:

```powershell
.\update-backend-url.ps1 "https://your-actual-backend-url.onrender.com"
```

Or manually update `.env.production`:
```env
VITE_API_URL=https://your-actual-backend-url.onrender.com
```

### Step 3: Rebuild and Redeploy Frontend

```powershell
npm run build
firebase deploy --only hosting
```

### Step 4: Test Everything

1. **Test Backend Health**:
   Visit: `https://your-backend-url.onrender.com/health`
   Should return: `{"status":"ok"}`

2. **Test Frontend**:
   - Go to: https://clinomatrix.web.app
   - Try to signup/login
   - Try forgot password (OTP should work)
   - Try admin login: https://clinomatrix.web.app/admin/login

## What This Fixes

✅ **OTP System**: Emails will be sent from deployed backend
✅ **Login/Signup**: Authentication will work
✅ **Database**: Supabase connection will work
✅ **Admin Login**: Admin authentication will work
✅ **Password Reset**: Reset functionality will work

## Important Notes

### Free Tier Limitations (Render.com)
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month free (enough for 24/7 operation)

### Security
- All sensitive keys are in environment variables (not in code)
- HTTPS is automatic on Render
- OTPs are never exposed in API responses
- Passwords are hashed with bcrypt

## Alternative: Railway.app

If Render doesn't work, try Railway.app (also free):

1. Visit: https://railway.app/
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Set root directory: `backend`
6. Add same environment variables
7. Deploy!

Railway gives $5 free credit/month.

## Troubleshooting

### Backend deployment fails
- Check build logs in Render dashboard
- Verify all environment variables are set correctly
- Make sure no typos in variable names

### Frontend can't connect to backend
- Check CORS settings in backend (ALLOWED_ORIGINS)
- Verify VITE_API_URL in .env.production is correct
- Make sure you rebuilt frontend after updating URL

### OTP emails not sending
- Check EMAIL_USER and EMAIL_PASS are correct
- Verify Gmail app password is valid
- Check backend logs for SMTP errors

### Database not working
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check Supabase dashboard for connection issues
- Review backend logs for database errors

## Need Help?

Check these files:
- `RENDER_DEPLOYMENT_STEPS.md` - Detailed Render deployment
- `backend/src/server.ts` - Backend configuration
- `backend/.env` - Local environment variables
- `.env.production` - Production frontend variables

## Summary

1. Deploy backend to Render.com (10 minutes)
2. Copy backend URL
3. Update `.env.production` with backend URL
4. Rebuild and redeploy frontend (5 minutes)
5. Test everything works!

Total time: ~15-20 minutes
Cost: $0 (completely free)
