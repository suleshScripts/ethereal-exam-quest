# 🚀 DEPLOY YOUR BACKEND NOW - 5 MINUTES

## ✅ Everything is Ready!
- ✅ Backend code fixed and tested
- ✅ TypeScript builds successfully
- ✅ Code pushed to GitHub
- ✅ All configurations ready

## 🎯 Deploy in 5 Steps

### Step 1: Open Render Dashboard
Click this link: **https://dashboard.render.com/**

Sign up/Login with your GitHub account

### Step 2: Create New Web Service
1. Click the blue **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if needed to link GitHub
4. Find and select: **suleshScripts/ethereal-exam-quest**
5. Click **"Connect"**

### Step 3: Configure Service
Fill in these exact values:

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

### Step 4: Add Environment Variables
Click **"Advanced"** button, then add these one by one:

**Click "Add Environment Variable" for each:**

```
NODE_ENV
production

PORT
8080

VITE_SUPABASE_URL
https://ftssqrpnqwwuuskphgnz.supabase.co/

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDI3NzgsImV4cCI6MjA4MDUxODc3OH0.5IEakfRUWyVwpeWkYO5G7ZJwTg0z5kebgZr2IPVWFks

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw

JWT_SECRET
your-super-secret-jwt-key-change-this-to-256-bit-random-string

JWT_ACCESS_EXPIRY
15m

JWT_REFRESH_EXPIRY
30d

EMAIL_USER
suleshwaghmare2004@gmail.com

EMAIL_PASS
zrxrnhxnhaflrcne

RAZORPAY_KEY_ID
rzp_live_Rlz1BRY2tHLFgm

RAZORPAY_KEY_SECRET
your_razorpay_secret_here

ALLOWED_ORIGINS
https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

### Step 5: Deploy!
1. Click **"Create Web Service"** button at the bottom
2. Wait 5-10 minutes for deployment
3. Watch the logs - you'll see:
   - Installing dependencies...
   - Building TypeScript...
   - Starting server...
   - ✅ **Live!**

## 📋 After Deployment

### 1. Copy Your Backend URL
After deployment, you'll see a URL like:
```
https://dmlt-academy-backend.onrender.com
```
**COPY THIS URL!**

### 2. Test Backend
Open this URL in browser (replace with your actual URL):
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{"status":"ok","timestamp":"..."}
```

### 3. Update Frontend
Run these commands in PowerShell:

```powershell
# Update backend URL (use YOUR actual URL from Render)
.\update-backend-url.ps1 "https://your-actual-backend-url.onrender.com"

# Rebuild frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### 4. Test Everything
Visit: **https://clinomatrix.web.app**

Test:
- ✅ Signup
- ✅ Login  
- ✅ Forgot Password (OTP)
- ✅ Admin Login: https://clinomatrix.web.app/admin/login
  - Email: suleshw143@gmail.com
  - Password: sulesh123456

## 🎉 Done!

Everything will work:
- OTP emails will send ✅
- Login/Signup will work ✅
- Database will work ✅
- Admin panel will work ✅

## ⚠️ Important Notes

**Free Tier:**
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- This is normal for free tier!

**If Deployment Fails:**
1. Check the logs in Render dashboard
2. Make sure all environment variables are correct
3. Verify build command completed successfully

## 🆘 Need Help?

If you see errors:
1. Check Render dashboard logs
2. Make sure GitHub repo is connected
3. Verify all environment variables are set
4. Check that root directory is set to `backend`

## 🔗 Quick Links

- Render Dashboard: https://dashboard.render.com/
- Your Frontend: https://clinomatrix.web.app
- Your GitHub: https://github.com/suleshScripts/ethereal-exam-quest

---

**Ready? Click here to start: https://dashboard.render.com/** 🚀
