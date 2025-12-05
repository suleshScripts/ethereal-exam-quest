# 🚀 START HERE - Fix Your Deployed Website

## The Problem (Simple Explanation)

Your website is live at https://clinomatrix.web.app but **nothing works** because:
- The website (frontend) is on the internet ✅
- The server (backend) is still on your computer ❌

It's like having a store open but the warehouse is at your home - customers can't get products!

## The Solution (Simple)

Put your server (backend) on the internet too, so your website can talk to it.

## How to Fix (3 Steps - 15 Minutes)

### Step 1: Deploy Backend to Render.com (FREE)

1. Open: https://dashboard.render.com/
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"
4. Select your repo: `suleshScripts/ethereal-exam-quest`
5. Fill in:
   ```
   Name: dmlt-academy-backend
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
6. Click "Advanced" and copy-paste these environment variables:

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

7. Click "Create Web Service"
8. Wait 10 minutes for deployment
9. **COPY YOUR BACKEND URL** (looks like: `https://dmlt-academy-backend.onrender.com`)

### Step 2: Connect Frontend to Backend

Run these commands in PowerShell:

```powershell
# Update backend URL (replace with YOUR actual URL from Step 1)
.\update-backend-url.ps1 "https://your-actual-backend-url.onrender.com"

# Rebuild frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Step 3: Test Everything

Visit your website: https://clinomatrix.web.app

Try:
- ✅ Signup
- ✅ Login
- ✅ Forgot Password (OTP)
- ✅ Admin Login: https://clinomatrix.web.app/admin/login
  - Email: suleshw143@gmail.com
  - Password: sulesh123456

## That's It! 🎉

Everything will work:
- OTP emails will send ✅
- Login/Signup will work ✅
- Database will work ✅
- Admin panel will work ✅

## Cost: $0 (FREE)

Render.com free tier is perfect for your project.

## Need More Details?

Read these files in order:
1. **DEPLOYMENT_STATUS.md** - Understand the problem
2. **COMPLETE_DEPLOYMENT_GUIDE.md** - Detailed instructions
3. **RENDER_DEPLOYMENT_STEPS.md** - Render-specific steps

## Quick Test After Deployment

```powershell
.\test-deployed-backend.ps1 "https://your-backend-url.onrender.com"
```

## Help

If stuck, check:
- Render dashboard logs
- COMPLETE_DEPLOYMENT_GUIDE.md troubleshooting section
- Make sure all environment variables are set correctly

---

**Ready? Go to Step 1 above and start deploying! 🚀**
