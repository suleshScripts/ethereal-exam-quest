#!/bin/bash

# Deployment script for DMLT Academy

echo "🚀 Starting deployment process..."

# Step 1: Build Frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed"
  exit 1
fi

echo "✅ Frontend build successful"

# Step 2: Deploy to Firebase Hosting
echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
  echo "❌ Firebase deployment failed"
  exit 1
fi

echo "✅ Firebase deployment successful"

# Step 3: Deploy Backend (optional - uncomment if needed)
# echo "☁️  Deploying backend to Cloud Run..."
# cd backend
# gcloud builds submit --tag gcr.io/dmlt-academy/exam-backend
# gcloud run deploy exam-backend --image gcr.io/dmlt-academy/exam-backend --platform managed --region asia-south1
# cd ..

echo "🎉 Deployment complete!"
echo "Frontend: https://dmlt-academy.web.app"
