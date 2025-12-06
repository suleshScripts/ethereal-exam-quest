# DMLT Academy Exam Portal

A comprehensive online examination platform built for DMLT Academy with secure authentication, email verification, payment integration, and real-time exam monitoring.

## 🚨 SECURITY NOTICE

**⚠️ CRITICAL: If you cloned this repository before [DATE], all secrets have been exposed and MUST be rotated immediately.**

See [SECURITY_SETUP_GUIDE.md](./SECURITY_SETUP_GUIDE.md) for detailed instructions on:
- Rotating Supabase keys
- Rotating Razorpay API keys
- Changing email passwords
- Generating new JWT secrets
- Enabling Row Level Security (RLS)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Razorpay account (for payments)
- Gmail account with App Password (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ethereal-exam-quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Configure Environment Variables**

   **Frontend (.env):**
   ```bash
   cp .env.example .env
   ```

   Fill in:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Backend (backend/.env):**
   ```bash
   cp backend/.env.example backend/.env
   ```

   Fill in:
   ```env
   NODE_ENV=development
   PORT=8080
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_generated_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Set up Supabase Database**

   Run `SECURITY_FIXES.sql` in your Supabase SQL Editor to:
   - Enable Row Level Security (RLS)
   - Create security policies
   - Set up email verification table

5. **Start Development Servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   npm run dev
   ```

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Email verification system
- ✅ Rate limiting on sensitive endpoints
- ✅ HTTPS enforcement in production
- ✅ CORS configuration
- ✅ Input validation and sanitization

## 📚 Documentation

- [Security Setup Guide](./SECURITY_SETUP_GUIDE.md) - **READ THIS FIRST**
- [API Endpoints](./API_ENDPOINTS.md) - Complete API documentation
- [Deployment Guide](./DEPLOYMENT_COMPLETE.md) - Production deployment instructions

## 🏗️ Architecture

### Frontend
- React + TypeScript
- Vite build tool
- TailwindCSS + shadcn/ui
- React Router for navigation

### Backend
- Node.js + Express
- TypeScript
- Supabase for database
- JWT for authentication
- Nodemailer for emails
- Razorpay for payments

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy --only hosting
```

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables in Render Dashboard
3. Deploy automatically on push

**Important:** Never commit secrets to `render.yaml`. Set them in Render Dashboard.

## 🧪 Testing

Run the application locally and test:
- User signup with email verification
- Login/logout
- Password reset with OTP
- Payment integration
- Admin panel access

## ⚠️ Important Notes

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Rotate all secrets** if they were ever committed
3. **Enable RLS** in Supabase before going to production
4. **Use environment variables** for all sensitive data
5. **Test RLS** with Burp Suite to ensure data isolation

## 📞 Support

For security issues, please refer to [SECURITY_SETUP_GUIDE.md](./SECURITY_SETUP_GUIDE.md)

## 📄 License

[Your License Here]

---

**Remember: Security is not optional. Follow the security guide before deploying to production.**
