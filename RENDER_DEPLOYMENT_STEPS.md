# Deploy Backend to Render.com (FREE)

## Quick Deploy Steps

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com/

### 2. Create New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub account if not already connected
- Select repository: `suleshScripts/ethereal-exam-quest`
- Click "Connect"

### 3. Configure Service
Fill in these settings:

**Basic Settings:**
- Name: `dmlt-academy-backend` (or any name you prefer)
- Region: `Singapore` (closest to India)
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Instance Type: `Free`

### 4. Add Environment Variables
Click "Advanced" and add these environment variables:

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

### 5. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Once deployed, you'll get a URL like: `https://dmlt-academy-backend.onrender.com`

### 6. Copy Backend URL
After deployment completes, copy your backend URL (it will look like):
```
https://dmlt-academy-backend.onrender.com
```

### 7. Update Frontend Environment
Update `.env.production` with your backend URL:
```bash
VITE_API_URL=https://dmlt-academy-backend.onrender.com
```

### 8. Rebuild and Redeploy Frontend
```bash
npm run build
firebase deploy --only hosting
```

## Testing Backend
Once deployed, test these endpoints:

1. Health check:
```
https://your-backend-url.onrender.com/health
```

2. Test OTP:
```bash
curl -X POST https://your-backend-url.onrender.com/api/otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Important Notes

⚠️ **Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month free (enough for one service running 24/7)

✅ **Advantages:**
- No credit card required
- Automatic HTTPS
- Auto-deploys on git push
- Built-in logging and monitoring

## Troubleshooting

If deployment fails:
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Make sure `backend/package.json` has correct scripts
4. Check that TypeScript compiles: `cd backend && npm run build`

## Alternative: Railway.app

If Render doesn't work, try Railway.app:
1. Visit: https://railway.app/
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Set root directory to `backend`
6. Add same environment variables
7. Deploy!

Railway also has a free tier with $5 credit/month.
