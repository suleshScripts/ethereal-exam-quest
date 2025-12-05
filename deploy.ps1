# PowerShell deployment script for DMLT Academy

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Step 1: Build Frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build successful" -ForegroundColor Green

# Step 2: Deploy to Firebase Hosting
Write-Host "🔥 Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Firebase deployment successful" -ForegroundColor Green

# Step 3: Deploy Backend (optional - uncomment if needed)
# Write-Host "☁️  Deploying backend to Cloud Run..." -ForegroundColor Yellow
# cd backend
# gcloud builds submit --tag gcr.io/dmlt-academy/exam-backend
# gcloud run deploy exam-backend --image gcr.io/dmlt-academy/exam-backend --platform managed --region asia-south1
# cd ..

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "Frontend: https://dmlt-academy.web.app" -ForegroundColor Cyan
