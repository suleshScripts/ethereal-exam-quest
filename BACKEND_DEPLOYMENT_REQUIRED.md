# ⚠️ Backend Deployment Required

## Current Situation

✅ **Frontend**: Deployed and live at https://clinomatrix.web.app  
❌ **Backend**: Still running locally (not accessible from internet)

This is why login, signup, and OTP are not working on the live site.

## Quick Solution Options

### Option 1: Install Google Cloud SDK and Deploy (Recommended)

#### Step 1: Install Google Cloud SDK

**Windows**:
1. Download: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
2. Run the installer
3. Follow the installation wizard
4. Restart your terminal/PowerShell

**Verify Installation**:
```bash
gcloud --version
```

#### Step 2: Deploy Backend

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project clinomatrix

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Deploy backend
cd backend
gcloud run deploy exam-backend --source . --region asia-south1 --allow-unauthenticated
```

#### Step 3: Update Frontend

After deployment, you'll get a URL like:
```
https://exam-backend-xyz-asia-south1.run.app
```

Then:
```bash
# Update .env.production with the backend URL
# Edit the file and change VITE_API_URL

# Rebuild and redeploy frontend
npm run build
firebase deploy --only hosting
```

### Option 2: Use Render.com (Free, No Credit Card)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: dmlt-academy-backend
   - Environment: Node
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Add environment variables (from backend/.env)
6. Click "Create Web Service"
7. Copy the URL (e.g., https://dmlt-academy-backend.onrender.com)
8. Update frontend and redeploy

### Option 3: Use Railway.app (Free, No Credit Card)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - Root Directory: backend
   - Add environment variables
6. Deploy
7. Copy the URL
8. Update frontend and redeploy

### Option 4: Keep Backend Local (Temporary Testing)

For testing purposes only, you can:

1. Keep backend running locally: `cd backend && npm run dev`
2. Use ngrok to expose it: https://ngrok.com
   ```bash
   ngrok http 8080
   ```
3. Copy the ngrok URL (e.g., https://abc123.ngrok.io)
4. Update frontend .env.production
5. Redeploy frontend

**Note**: ngrok URLs change every time you restart, so this is only for testing.

## Recommended: Google Cloud Run

### Why Cloud Run?
- ✅ Free tier (2 million requests/month)
- ✅ Auto-scaling
- ✅ HTTPS by default
- ✅ Fast deployment
- ✅ Easy to manage
- ✅ Integrated with Firebase

### Installation Links

**Google Cloud SDK**:
- Windows: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
- Mac: `brew install google-cloud-sdk`
- Linux: https://cloud.google.com/sdk/docs/install

## After Backend Deployment

Once backend is deployed:

1. **Update Frontend Environment**:
   ```env
   # .env.production
   VITE_API_URL=https://your-backend-url
   ```

2. **Rebuild Frontend**:
   ```bash
   npm run build
   ```

3. **Redeploy Frontend**:
   ```bash
   firebase deploy --only hosting
   ```

4. **Test Everything**:
   - Visit https://clinomatrix.web.app
   - Try signup
   - Try login
   - Test OTP
   - Test admin login

## Current Backend Status

Your backend is running locally at:
- http://localhost:8080

This works on your computer but not from the internet.

## What's Not Working on Live Site

Because backend is not deployed:
- ❌ User signup
- ❌ User login
- ❌ Admin login
- ❌ Password reset
- ❌ OTP sending
- ❌ Profile management
- ❌ Exam features

## What IS Working on Live Site

- ✅ Page loading
- ✅ UI components
- ✅ Routing
- ✅ Static content

## Quick Test

To verify backend is the issue:

1. Open https://clinomatrix.web.app
2. Open browser console (F12)
3. Try to login
4. You'll see error: "Failed to fetch" or "Network error"
5. This confirms backend is not accessible

## Need Help?

If you're having trouble with deployment:

1. **Install Google Cloud SDK** (easiest option)
2. Run the deployment commands above
3. Or use Render.com/Railway.app (no installation needed)

## Summary

**Problem**: Backend running locally, not accessible from internet  
**Solution**: Deploy backend to Cloud Run, Render, or Railway  
**Recommended**: Google Cloud Run (free, fast, integrated)  
**Time**: ~10 minutes after SDK installation  

---

**Next Step**: Install Google Cloud SDK and deploy backend

**Download**: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
