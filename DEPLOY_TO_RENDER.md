# 🚀 Deploy Backend to Render.com (No Installation Required!)

## Why Render.com?

- ✅ **No installation needed** (unlike Google Cloud SDK)
- ✅ **Free tier** (750 hours/month)
- ✅ **No credit card required**
- ✅ **Deploy in 5 minutes**
- ✅ **Auto HTTPS**
- ✅ **Easy to use**

## Step-by-Step Deployment

### Step 1: Sign Up for Render

1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended) or email
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository
4. Select: `ethereal-exam-quest` repository

### Step 3: Configure Service

Fill in these settings:

**Basic Settings**:
- **Name**: `dmlt-academy-backend`
- **Region**: Singapore (or closest to you)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings**:
- **Plan**: Free
- **Auto-Deploy**: Yes

### Step 4: Add Environment Variables

Click "Advanced" and add these environment variables:

```
NODE_ENV=production
PORT=8080
VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw
JWT_SECRET=your-super-secret-jwt-key-change-this-to-256-bit-random-string
EMAIL_USER=suleshwaghmare2004@gmail.com
EMAIL_PASS=zrxrnhxnhaflrcne
RAZORPAY_KEY_ID=rzp_live_Rlz1BRY2tHLFgm
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
ALLOWED_ORIGINS=https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. You'll see logs in real-time
4. Once deployed, you'll get a URL like:
   ```
   https://dmlt-academy-backend.onrender.com
   ```

### Step 6: Update Frontend

1. Edit `.env.production`:
   ```env
   VITE_API_URL=https://dmlt-academy-backend.onrender.com
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   ```

3. Redeploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

### Step 7: Test

1. Visit: https://clinomatrix.web.app
2. Try signup
3. Try login
4. Test OTP
5. Everything should work! ✅

## Alternative: One-Click Deploy

Click this button to deploy directly:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Then:
1. Connect your GitHub
2. Select repository
3. Add environment variables
4. Click "Apply"

## Render.com Features

### Free Tier Includes:
- 750 hours/month (enough for 24/7 operation)
- 512 MB RAM
- Shared CPU
- Auto HTTPS/SSL
- Custom domains
- Auto-deploy from Git

### Limitations:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 100 GB bandwidth/month

### Upgrade ($7/month):
- Always on (no spin-down)
- 1 GB RAM
- Dedicated CPU
- Faster performance

## Monitoring

### View Logs
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. See real-time logs

### View Metrics
1. Click "Metrics" tab
2. See CPU, memory, requests

### Manual Deploy
1. Click "Manual Deploy"
2. Select branch
3. Click "Deploy"

## Troubleshooting

### Issue: Build Failed
**Solution**: 
- Check build logs
- Verify package.json has "build" script
- Check tsconfig.json exists in backend folder

### Issue: Service Won't Start
**Solution**:
- Check start logs
- Verify PORT=8080
- Check all environment variables are set

### Issue: CORS Error
**Solution**:
- Verify ALLOWED_ORIGINS includes your frontend URL
- Check backend logs for CORS errors

### Issue: Database Connection Failed
**Solution**:
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check Supabase URL is correct

## Cost Comparison

| Service | Free Tier | Paid Tier | Best For |
|---------|-----------|-----------|----------|
| Render | 750 hrs/mo | $7/mo | Easy deployment |
| Cloud Run | 2M req/mo | Pay per use | High traffic |
| Railway | 500 hrs/mo | $5/mo | Simple apps |
| Heroku | None | $7/mo | Legacy apps |

## After Deployment

### Update Backend URL Everywhere

1. **Frontend .env.production**:
   ```env
   VITE_API_URL=https://dmlt-academy-backend.onrender.com
   ```

2. **Rebuild and redeploy frontend**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

3. **Test all features**:
   - Signup ✅
   - Login ✅
   - Admin login ✅
   - OTP ✅
   - Password reset ✅

### Monitor Your Service

- Dashboard: https://dashboard.render.com
- Logs: Real-time in dashboard
- Metrics: CPU, memory, requests
- Alerts: Email notifications

## Quick Commands

```bash
# Update frontend after backend deployment
npm run build
firebase deploy --only hosting

# Test backend
curl https://dmlt-academy-backend.onrender.com/health

# Test signup
curl -X POST https://dmlt-academy-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","username":"test","phone":"1234567890","password":"Test123"}'
```

## Summary

1. ✅ Sign up at https://render.com
2. ✅ Create new web service
3. ✅ Connect GitHub repository
4. ✅ Configure settings (root: backend)
5. ✅ Add environment variables
6. ✅ Deploy (wait 5-10 minutes)
7. ✅ Copy backend URL
8. ✅ Update frontend .env.production
9. ✅ Rebuild and redeploy frontend
10. ✅ Test everything!

**Time**: ~15 minutes total  
**Cost**: Free  
**Difficulty**: Easy  

---

**Start here**: https://render.com

**Your backend will be live at**: https://dmlt-academy-backend.onrender.com

**Then your full app will work at**: https://clinomatrix.web.app
