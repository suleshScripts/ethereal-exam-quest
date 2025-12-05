# 👆 CLICK-BY-CLICK DEPLOYMENT GUIDE

## Your backend is ready! Just follow these clicks:

---

## 🌐 STEP 1: Render Dashboard (Already Open)

You should see the Render dashboard in your browser.

**If not open, click:** https://dashboard.render.com/

**Action:** Sign up or Login with GitHub

---

## ➕ STEP 2: Create New Service

**Click:** Blue **"New +"** button (top right corner)

**Then Click:** **"Web Service"**

---

## 🔗 STEP 3: Connect GitHub

**If you see "Connect account":**
- Click **"Connect account"**
- Authorize Render to access GitHub
- Come back to Render

**Find your repo:**
- Scroll or search for: **ethereal-exam-quest**
- **Click:** **"Connect"** button next to it

---

## ⚙️ STEP 4: Configure Service

You'll see a form. Fill it in:

### Basic Settings:

**Name:**
```
dmlt-academy-backend
```

**Region:**
```
Singapore
```
(Select from dropdown)

**Branch:**
```
main
```

**Root Directory:**
```
backend
```
⚠️ IMPORTANT: Type exactly `backend`

**Runtime:**
```
Node
```
(Should auto-detect)

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Instance Type:**
```
Free
```
(Select from dropdown)

---

## 🔐 STEP 5: Add Environment Variables

**Click:** **"Advanced"** button (below Instance Type)

**Then:** Click **"Add Environment Variable"** button

**Add these 12 variables one by one:**

### Variable 1:
```
Key: NODE_ENV
Value: production
```

### Variable 2:
```
Key: PORT
Value: 8080
```

### Variable 3:
```
Key: VITE_SUPABASE_URL
Value: https://ftssqrpnqwwuuskphgnz.supabase.co/
```

### Variable 4:
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDI3NzgsImV4cCI6MjA4MDUxODc3OH0.5IEakfRUWyVwpeWkYO5G7ZJwTg0z5kebgZr2IPVWFks
```

### Variable 5:
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw
```

### Variable 6:
```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-to-256-bit-random-string
```

### Variable 7:
```
Key: JWT_ACCESS_EXPIRY
Value: 15m
```

### Variable 8:
```
Key: JWT_REFRESH_EXPIRY
Value: 30d
```

### Variable 9:
```
Key: EMAIL_USER
Value: suleshwaghmare2004@gmail.com
```

### Variable 10:
```
Key: EMAIL_PASS
Value: zrxrnhxnhaflrcne
```

### Variable 11:
```
Key: RAZORPAY_KEY_ID
Value: rzp_live_Rlz1BRY2tHLFgm
```

### Variable 12:
```
Key: RAZORPAY_KEY_SECRET
Value: your_razorpay_secret_here
```

### Variable 13:
```
Key: ALLOWED_ORIGINS
Value: https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

---

## 🚀 STEP 6: Deploy!

**Scroll down to bottom**

**Click:** Big blue **"Create Web Service"** button

---

## ⏳ STEP 7: Wait for Deployment

You'll see logs scrolling:

```
==> Cloning from GitHub...
==> Installing dependencies...
==> Building...
==> Starting service...
==> Your service is live!
```

**Wait:** 5-10 minutes

**When you see:** "Your service is live" ✅

---

## 📋 STEP 8: Copy Your Backend URL

At the top of the page, you'll see your URL:

```
https://dmlt-academy-backend.onrender.com
```

**COPY THIS URL!** You'll need it next.

---

## 🧪 STEP 9: Test Backend

Open your backend URL in a new tab:
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{"status":"ok","timestamp":"2025-12-05T..."}
```

✅ If you see this, backend is working!

---

## 🔄 STEP 10: Update Frontend

Open PowerShell in your project folder and run:

```powershell
# Update backend URL (replace with YOUR actual URL)
.\update-backend-url.ps1 "https://your-actual-backend-url.onrender.com"

# Rebuild frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Wait 2-3 minutes for deployment.

---

## ✅ STEP 11: Test Everything!

Visit: **https://clinomatrix.web.app**

### Test 1: Signup
- Click "Sign Up"
- Enter email, password, name
- Should work! ✅

### Test 2: Login
- Click "Login"
- Enter credentials
- Should work! ✅

### Test 3: Forgot Password
- Click "Forgot Password"
- Enter email
- Check email for OTP
- Should receive email! ✅

### Test 4: Admin Login
- Go to: https://clinomatrix.web.app/admin/login
- Email: suleshw143@gmail.com
- Password: sulesh123456
- Should work! ✅

---

## 🎉 DONE!

Everything is now working:
- ✅ Backend deployed
- ✅ Frontend connected
- ✅ OTP emails sending
- ✅ Login/Signup working
- ✅ Admin panel working
- ✅ Database connected

---

## 📊 Summary

**What you deployed:**
- Backend: Render.com (free)
- Frontend: Firebase (free)
- Database: Supabase (free)

**Total cost:** $0.00

**Time taken:** ~15 minutes

---

## 🆘 If Something Goes Wrong

### Backend deployment fails:
1. Check Render logs for errors
2. Verify all environment variables are correct
3. Make sure root directory is `backend`
4. Check build command is correct

### Frontend can't connect:
1. Verify backend URL is correct in .env.production
2. Make sure you rebuilt frontend after updating URL
3. Check CORS settings (ALLOWED_ORIGINS)

### OTP not working:
1. Check EMAIL_USER and EMAIL_PASS are correct
2. Verify Gmail app password is valid
3. Check backend logs in Render

---

## 🔗 Quick Links

- **Render Dashboard:** https://dashboard.render.com/
- **Your Frontend:** https://clinomatrix.web.app
- **Admin Panel:** https://clinomatrix.web.app/admin/login
- **GitHub Repo:** https://github.com/suleshScripts/ethereal-exam-quest

---

**Ready? Start with Step 1!** 🚀

The Render dashboard should already be open in your browser.
