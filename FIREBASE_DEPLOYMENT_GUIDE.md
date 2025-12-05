# Firebase Deployment Guide

## Prerequisites

1. **Firebase CLI** installed globally
```bash
npm install -g firebase-tools
```

2. **Firebase Project** created at https://console.firebase.google.com/

3. **Google Cloud Project** for backend deployment

## Step 1: Firebase Authentication

```bash
# Login to Firebase
firebase login

# Verify you're logged in
firebase projects:list
```

If you see the error "Failed to get Firebase project dmlt-academy", it means:
- The project doesn't exist, OR
- You don't have access to it

### Solution A: Create New Project
```bash
# Create new Firebase project
firebase projects:create dmlt-academy

# Or use a different name
firebase projects:create your-project-name
```

### Solution B: Use Existing Project
```bash
# List your projects
firebase projects:list

# Use an existing project
firebase use your-existing-project-id

# Update .firebaserc
# Change "dmlt-academy" to your project ID
```

## Step 2: Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# This creates the 'dist' folder
```

## Step 3: Deploy Frontend to Firebase Hosting

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

Your frontend will be available at:
- https://dmlt-academy.web.app
- https://dmlt-academy.firebaseapp.com

## Step 4: Deploy Backend to Google Cloud Run

### 4.1: Install Google Cloud SDK
Download from: https://cloud.google.com/sdk/docs/install

### 4.2: Authenticate
```bash
gcloud auth login
gcloud config set project dmlt-academy
```

### 4.3: Build and Deploy Backend
```bash
cd backend

# Build Docker image
gcloud builds submit --tag gcr.io/dmlt-academy/exam-backend

# Deploy to Cloud Run
gcloud run deploy exam-backend \
  --image gcr.io/dmlt-academy/exam-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=8080,VITE_SUPABASE_URL=$SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_KEY,JWT_SECRET=$JWT_SECRET,EMAIL_USER=$EMAIL_USER,EMAIL_PASS=$EMAIL_PASS,ALLOWED_ORIGINS=https://dmlt-academy.web.app,https://dmlt-academy.firebaseapp.com
```

### 4.4: Get Backend URL
After deployment, you'll get a URL like:
```
https://exam-backend-xyz-asia-south1.run.app
```

## Step 5: Update Frontend Environment

Update `.env.production`:
```env
VITE_API_URL=https://exam-backend-xyz-asia-south1.run.app
VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Rebuild and redeploy frontend:
```bash
npm run build
firebase deploy --only hosting
```

## Step 6: Update Backend CORS

Update `backend/.env` for production:
```env
ALLOWED_ORIGINS=https://dmlt-academy.web.app,https://dmlt-academy.firebaseapp.com
```

Redeploy backend with new CORS settings.

## Security Checklist

### ✅ OTP Security (Already Implemented)
- [x] OTPs never sent in API responses
- [x] OTPs hashed with bcrypt before storage
- [x] 5-minute expiration
- [x] One-time use only
- [x] 3 failed attempts limit
- [x] 30-second cooldown between requests
- [x] Rate limiting (5 requests per 15 minutes)
- [x] Automatic cleanup after use

### ✅ HTTPS Enforcement
- [x] HSTS headers enabled
- [x] Automatic HTTP to HTTPS redirect in production
- [x] Secure cookies (httpOnly, secure, sameSite)

### ✅ Security Headers
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] X-XSS-Protection: 1; mode=block
- [x] Content-Security-Policy configured
- [x] Referrer-Policy: strict-origin-when-cross-origin

### ✅ API Security
- [x] Rate limiting on all auth endpoints
- [x] Input validation
- [x] CORS protection
- [x] JWT token authentication
- [x] Bcrypt password hashing

### 🔒 Additional Production Security

#### 1. Environment Variables
Never commit these to Git:
- JWT_SECRET
- SUPABASE_SERVICE_ROLE_KEY
- EMAIL_PASS
- RAZORPAY_KEY_SECRET

#### 2. Database Security
- Enable RLS policies
- Use service role only from backend
- Never expose service role key to frontend

#### 3. Monitoring
Set up:
- Cloud Logging
- Error tracking (Sentry)
- Uptime monitoring
- Security alerts

## Testing Deployment

### Test Frontend
```bash
# Open in browser
https://dmlt-academy.web.app

# Check console for errors
# Verify API calls work
```

### Test Backend
```bash
# Health check
curl https://exam-backend-xyz.run.app/health

# Test signup
curl -X POST https://exam-backend-xyz.run.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","username":"test","phone":"1234567890","password":"Test123"}'
```

### Test OTP Security
```bash
# Send OTP
curl -X POST https://exam-backend-xyz.run.app/api/otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'

# Response should NOT contain OTP
# OTP should only be in email
```

## Troubleshooting

### Issue: "Failed to get Firebase project"
**Solution**: 
```bash
firebase login
firebase projects:list
firebase use your-project-id
```

### Issue: "Permission denied"
**Solution**: Check IAM permissions in Google Cloud Console

### Issue: "CORS error in production"
**Solution**: Update ALLOWED_ORIGINS in backend environment variables

### Issue: "OTP not received"
**Solution**: 
- Check EMAIL_USER and EMAIL_PASS
- Verify Gmail App Password
- Check spam folder

## Deployment Commands Summary

```bash
# Frontend
npm run build
firebase deploy --only hosting

# Backend
cd backend
gcloud builds submit --tag gcr.io/dmlt-academy/exam-backend
gcloud run deploy exam-backend --image gcr.io/dmlt-academy/exam-backend

# Update environment
# Edit .env.production
npm run build
firebase deploy --only hosting
```

## Cost Estimation

### Firebase Hosting (Free Tier)
- 10 GB storage
- 360 MB/day bandwidth
- Usually sufficient for small apps

### Cloud Run (Free Tier)
- 2 million requests/month
- 360,000 GB-seconds/month
- Usually sufficient for small apps

### Supabase (Free Tier)
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

## Monitoring URLs

- Firebase Console: https://console.firebase.google.com/
- Google Cloud Console: https://console.cloud.google.com/
- Supabase Dashboard: https://app.supabase.com/

## Support

If you encounter issues:
1. Check Firebase logs: `firebase hosting:channel:list`
2. Check Cloud Run logs: `gcloud logging read`
3. Check Supabase logs in dashboard
4. Review security headers: https://securityheaders.com/

---

**Your app is now production-ready with enterprise-grade security!** 🎉
