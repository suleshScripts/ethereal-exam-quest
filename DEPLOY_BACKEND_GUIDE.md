# Deploy Backend to Google Cloud Run

## Prerequisites

1. **Google Cloud SDK** installed
   - Download: https://cloud.google.com/sdk/docs/install

2. **Docker** (optional, Cloud Build will handle it)

3. **Google Cloud Project** (we're using: clinomatrix)

## Step-by-Step Deployment

### Step 1: Install Google Cloud SDK

If not installed:
```bash
# Windows
# Download and run: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

# Verify installation
gcloud --version
```

### Step 2: Authenticate

```bash
# Login to Google Cloud
gcloud auth login

# Set project
gcloud config set project clinomatrix

# Verify
gcloud config list
```

### Step 3: Enable Required APIs

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com
```

### Step 4: Create Dockerfile (Already exists)

The Dockerfile in `backend/` directory:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### Step 5: Build and Deploy

```bash
cd backend

# Build Docker image using Cloud Build
gcloud builds submit --tag gcr.io/clinomatrix/exam-backend

# Deploy to Cloud Run
gcloud run deploy exam-backend \
  --image gcr.io/clinomatrix/exam-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars NODE_ENV=production,PORT=8080,VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/,SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw,JWT_SECRET=your-super-secret-jwt-key-change-this-to-256-bit-random-string,EMAIL_USER=suleshwaghmare2004@gmail.com,EMAIL_PASS=zrxrnhxnhaflrcne,ALLOWED_ORIGINS=https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

### Step 6: Get Backend URL

After deployment, you'll see:
```
Service [exam-backend] revision [exam-backend-00001-xyz] has been deployed and is serving 100 percent of traffic.
Service URL: https://exam-backend-xyz-asia-south1.run.app
```

Copy this URL!

### Step 7: Update Frontend

1. Edit `.env.production`:
```env
VITE_API_URL=https://exam-backend-xyz-asia-south1.run.app
```

2. Rebuild frontend:
```bash
npm run build
```

3. Redeploy frontend:
```bash
firebase deploy --only hosting
```

### Step 8: Test

```bash
# Test backend health
curl https://exam-backend-xyz-asia-south1.run.app/health

# Test signup
curl -X POST https://exam-backend-xyz-asia-south1.run.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","username":"test","phone":"1234567890","password":"Test123"}'
```

## Alternative: One-Line Deploy

```bash
cd backend && gcloud run deploy exam-backend --source . --region asia-south1 --allow-unauthenticated
```

This will:
1. Build the Docker image
2. Push to Container Registry
3. Deploy to Cloud Run
4. Prompt for environment variables

## Environment Variables

Set these in Cloud Run:

```env
NODE_ENV=production
PORT=8080
VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your-256-bit-random-secret
EMAIL_USER=suleshwaghmare2004@gmail.com
EMAIL_PASS=zrxrnhxnhaflrcne
RAZORPAY_KEY_ID=rzp_live_Rlz1BRY2tHLFgm
RAZORPAY_KEY_SECRET=your_razorpay_secret
ALLOWED_ORIGINS=https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

## Update Environment Variables Later

```bash
gcloud run services update exam-backend \
  --region asia-south1 \
  --update-env-vars ALLOWED_ORIGINS=https://clinomatrix.web.app,https://clinomatrix.firebaseapp.com
```

## Monitoring

### View Logs
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=exam-backend" --limit 50
```

### View Metrics
```bash
gcloud run services describe exam-backend --region asia-south1
```

### Cloud Console
https://console.cloud.google.com/run?project=clinomatrix

## Troubleshooting

### Issue: "Permission denied"
```bash
# Add yourself as owner
gcloud projects add-iam-policy-binding clinomatrix \
  --member="user:your-email@gmail.com" \
  --role="roles/owner"
```

### Issue: "API not enabled"
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Issue: "Build failed"
- Check Dockerfile syntax
- Verify package.json has "build" script
- Check backend/tsconfig.json exists

### Issue: "Service won't start"
- Check logs: `gcloud logging read`
- Verify PORT=8080
- Check environment variables

## Cost Estimation

### Cloud Run Pricing (Free Tier)
- 2 million requests/month: Free
- 360,000 GB-seconds: Free
- 180,000 vCPU-seconds: Free

Your app should stay within free tier for development/testing.

### Paid Tier (if exceeded)
- $0.00002400 per request
- $0.00001800 per GB-second
- $0.00000900 per vCPU-second

Estimated cost for 10,000 users/month: ~$5-10

## Security Best Practices

### ✅ Implemented
- HTTPS enforced (Cloud Run default)
- Environment variables (not in code)
- Service account authentication
- CORS protection
- Rate limiting

### 🔒 Recommended
- [ ] Set up Cloud Armor (DDoS protection)
- [ ] Enable Cloud CDN
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy
- [ ] Implement secrets manager
- [ ] Set up CI/CD pipeline

## CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: clinomatrix
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      
      - name: Deploy to Cloud Run
        run: |
          cd backend
          gcloud run deploy exam-backend \
            --source . \
            --region asia-south1 \
            --allow-unauthenticated
```

## Quick Commands

```bash
# Deploy
gcloud run deploy exam-backend --source . --region asia-south1

# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Update service
gcloud run services update exam-backend --region asia-south1

# Delete service
gcloud run services delete exam-backend --region asia-south1

# List services
gcloud run services list
```

## Summary

1. Install Google Cloud SDK
2. Authenticate: `gcloud auth login`
3. Set project: `gcloud config set project clinomatrix`
4. Deploy: `cd backend && gcloud run deploy exam-backend --source . --region asia-south1`
5. Copy backend URL
6. Update frontend `.env.production`
7. Redeploy frontend: `npm run build && firebase deploy`

---

**Your backend will be live at**: https://exam-backend-xyz-asia-south1.run.app

**Then your full app will work at**: https://clinomatrix.web.app
