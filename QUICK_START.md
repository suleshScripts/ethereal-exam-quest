# 🚀 Quick Start Guide

## Your Backend is Now Running!

### Current Status
- ✅ Backend: http://localhost:8080
- ✅ Frontend: http://localhost:8081
- ✅ Database: Connected to Supabase
- ✅ Test Users: Created successfully

## Start Development

### 1. Start Backend (if not running)
```bash
cd backend
npm run dev
```

### 2. Start Frontend (if not running)
```bash
npm run dev
```

### 3. Test Signup Flow
1. Open http://localhost:8081
2. Navigate to Signup page
3. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Username: yourusername
   - Phone: 1234567890
   - Password: YourPassword123
4. Click "Sign Up"
5. You should be automatically logged in!

## Important: Run Database Migrations

Before using the app, run these SQL scripts in Supabase SQL Editor:

1. `backend/migrations/001_create_sessions_table_fixed.sql`
2. `backend/migrations/002_create_otp_table.sql`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/logout` - Logout

### User (Requires Auth)
- GET `/api/user/profile` - Get profile
- PUT `/api/user/profile` - Update profile
- GET `/api/user/plans` - Get plans
- GET `/api/user/exam-history` - Get exam results

## Environment Files

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend `backend/.env`
```env
NODE_ENV=development
PORT=8080
VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your-super-secret-jwt-key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8081
```

## Test the API

Run the test script:
```bash
node test-backend.js
```

## Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Frontend can't connect
- Check backend is running on port 8080
- Check VITE_API_URL in frontend .env

### Database errors
- Verify Supabase credentials
- Run migration scripts
- Check Supabase dashboard

## Next Steps

1. ✅ Backend created and running
2. ⏳ Run database migrations
3. ⏳ Test signup/login flow
4. ⏳ Deploy to production

---

**Everything is set up and ready to go!** 🎉
