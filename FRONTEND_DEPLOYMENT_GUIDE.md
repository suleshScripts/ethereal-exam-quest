# Frontend Deployment Guide

## 🚨 Important: Frontend Needs to be Rebuilt

The backend is working perfectly, but the frontend needs to be rebuilt and redeployed with the production environment variables.

---

## ✅ Backend Status
- **URL:** https://dmlt-academy-backend.onrender.com
- **Status:** ✅ Working perfectly
- **Signup:** ✅ Tested and working
- **Email:** ✅ Sending verification codes

---

## 🔧 Deploy Frontend to Firebase

### Step 1: Build with Production Environment

```bash
# Build the frontend with production env
npm run build
```

This will use `.env.production` which has:
```env
VITE_API_URL=https://dmlt-academy-backend.onrender.com
```

### Step 2: Deploy to Firebase

```bash
# Deploy to Firebase
firebase deploy
```

Or if you have a specific hosting target:
```bash
firebase deploy --only hosting
```

### Step 3: Verify Deployment

1. Visit: https://dmltacademy.web.app
2. Open browser console (F12)
3. Go to Network tab
4. Try to signup
5. Check the API URL in the network requests

It should be calling: `https://dmlt-academy-backend.onrender.com/api/auth/signup`

---

## 🧪 Test After Deployment

### Test Signup Flow:

1. Go to https://dmltacademy.web.app/signup
2. Fill in the form:
   - Full Name: Test User
   - Username: testuser123
   - Phone: 9876543210
   - Email: your-email@example.com
   - Password: Test@123456
3. Click "Create Account"
4. ✅ Verification modal should appear
5. ✅ Check your email for the code
6. Enter the code
7. ✅ Success!

---

## 🔍 Troubleshooting

### If you still get 500 error:

1. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in browser settings

2. **Check Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Try signup again
   - Check the request URL - should be `https://dmlt-academy-backend.onrender.com`

3. **Check Console for Errors**
   - Look for CORS errors
   - Look for network errors
   - Check what data is being sent

4. **Verify Environment**
   - Make sure you built with `npm run build` (not `npm run dev`)
   - Check that `.env.production` has the correct API URL

---

## 📊 Current Status

### Backend ✅
- Deployed to Render
- All endpoints working
- CORS configured correctly
- Email sending working

### Frontend ⚠️
- Needs rebuild with production env
- Needs redeployment to Firebase
- Then will work perfectly

---

## 🚀 Quick Deploy Commands

```bash
# 1. Build frontend
npm run build

# 2. Deploy to Firebase
firebase deploy

# 3. Test
# Visit https://dmltacademy.web.app/signup
```

---

## ✅ After Deployment

Once deployed, the signup flow will work:
1. User fills form
2. Clicks "Create Account"
3. Backend creates account
4. Sends verification email
5. Modal appears
6. User enters code
7. Account verified!

**Everything is ready on the backend side!** Just need to deploy the frontend. 🚀
