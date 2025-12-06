import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger';

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  logger.info('✅ SendGrid initialized');
}

const router = express.Router();

// In-memory OTP store (for demo - use Redis in production)
// SECURITY: Store hashed OTPs, never plain text
const otpStore: Record<string, { 
  hash: string; 
  expiresAt: number; 
  used: boolean;
  attempts: number; // Track failed attempts
  createdAt: number; // Track when OTP was created
}> = {};
const sendCooldown: Record<string, number> = {};

// Maximum verification attempts before blocking
const MAX_VERIFY_ATTEMPTS = 3;

// Create transporter for Gmail
// Using port 587 with STARTTLS for better compatibility with cloud hosts
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify transporter on startup (don't block server start)
transporter.verify().then(() => {
  logger.info('✅ SMTP ready — transporter verified.');
}).catch(err => {
  logger.error('❌ SMTP verification failed. Check EMAIL_USER / EMAIL_PASS');
  logger.error(err.message || err);
});

// Rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many OTP requests, please try again later',
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
router.post(
  '/send-otp',
  otpLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('name').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email, name } = req.body;
      const userName = name || 'User';

      // Cooldown check: 30 seconds between requests
      const now = Date.now();
      const nextAllowed = sendCooldown[email] || 0;
      if (now < nextAllowed) {
        const wait = Math.ceil((nextAllowed - now) / 1000);
        return res.status(429).json({
          success: false,
          message: `Wait ${wait}s before requesting another OTP.`,
        });
      }

      const otp = generateOTP();
      const hash = await bcrypt.hash(otp, 10);

      otpStore[email] = {
        hash,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        used: false,
        attempts: 0,
        createdAt: Date.now(),
      };

      // Set cooldown
      sendCooldown[email] = Date.now() + 30 * 1000; // 30 seconds

      const mailOptions = {
        from: `"DMLT Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code - DMLT Academy',
        html: `
        <div style="margin:0;padding:0;background:#f4f5f7;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" 
            style="background:#f4f5f7;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" 
                  style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                  
                  <tr>
                    <td style="padding:0;margin:0;">
                      <div style="
                        background:url('https://i.ibb.co/yBXrWc3H/final-hero-bg.jpg');
                        background-size:cover;
                        background-position:center;
                        padding:40px 20px;
                        text-align:center;
                        color:white;">
                        
                        <img 
                          src="https://i.ibb.co/W4jLJpcz/dmlt-logo.jpg" 
                          alt="DMLT Academy" 
                          style="width:180px;margin-bottom:20px;border-radius:6px;"
                        />

                        <h1 style="margin:0;font-size:26px;letter-spacing:0.5px;font-weight:700;color:#063056;">
                          Verification Code
                        </h1>

                        <p style="margin-top:10px;font-size:15px;color:#063056;">
                          Secure login for DMLT Academy
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:30px 40px;color:#333333;">
                      <p style="font-size:16px;margin:0 0 20px 0;">
                        Hi <strong>${userName}</strong>,
                      </p>

                      <p style="font-size:15px;line-height:1.6;margin:0 0 25px;">
                        Your verification code for <strong>DMLT Academy</strong> is:
                      </p>

                      <div style="
                        background:#f1f5f9;
                        border:1px solid #dbe3eb;
                        border-radius:8px;
                        padding:18px;
                        text-align:center;
                        font-size:32px;
                        font-weight:700;
                        letter-spacing:4px;
                        color:#111827;">
                        ${otp}
                      </div>

                      <p style="font-size:15px;line-height:1.6;margin:25px 0 20px;">
                        This code will expire in <strong>5 minutes</strong>.
                      </p>

                      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:30px;">
                        If you didn't request this code, simply ignore this email.
                      </p>

                      <p style="font-size:15px;margin:0;">
                        Best regards,<br/>
                        <strong>DMLT Academy Team</strong>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background:#f8fafc;padding:18px;text-align:center;color:#94a3b8;font-size:12px;">
                      © ${new Date().getFullYear()} DMLT Academy. All rights reserved.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>`,
      };

      // Try to send email using SendGrid first, then fall back to SMTP
      let emailSent = false;
      let emailMethod = 'none';

      // Try SendGrid first (works on Render free tier)
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        try {
          const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Your Verification Code - DMLT Academy',
            html: mailOptions.html,
          };

          await sgMail.send(msg);
          emailSent = true;
          emailMethod = 'SendGrid';
          logger.info(`[OTP] Sent OTP to ${email} via SendGrid`);
        } catch (sgError: any) {
          logger.error('[OTP] SendGrid failed:', sgError.message);
        }
      }

      // Fall back to SMTP if SendGrid not configured or failed
      if (!emailSent) {
        try {
          await Promise.race([
            transporter.sendMail(mailOptions),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email send timeout')), 15000)
            )
          ]);
          emailSent = true;
          emailMethod = 'SMTP';
          logger.info(`[OTP] Sent OTP to ${email} via SMTP`);
        } catch (smtpError: any) {
          logger.error('[OTP] SMTP failed:', smtpError.message);
        }
      }

      // Log OTP to console if email failed (for development/testing)
      if (!emailSent) {
        logger.warn(`[OTP] ⚠️ EMAIL FAILED - OTP for ${email}: ${otp}`);
        logger.warn('[OTP] Configure SENDGRID_API_KEY for reliable email delivery');
      }

      // Always return success if OTP is stored
      res.json({
        success: true,
        message: emailSent 
          ? `OTP sent to your email via ${emailMethod}.` 
          : 'OTP generated. Check your email or contact support if not received.',
        // NEVER include OTP in response for security
      });
    } catch (error: any) {
      logger.error('[OTP] Send error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
      });
    }
  }
);

// Verify OTP endpoint
router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email, otp } = req.body;

      const record = otpStore[email];
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'No OTP found for that email.',
        });
      }

      if (record.used) {
        return res.status(400).json({
          success: false,
          message: 'OTP already used.',
        });
      }

      if (Date.now() > record.expiresAt) {
        // Clean up expired OTP
        delete otpStore[email];
        return res.status(400).json({
          success: false,
          message: 'OTP expired.',
        });
      }

      // SECURITY: Check for too many failed attempts
      if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
        delete otpStore[email];
        logger.warn(`[OTP] Too many failed attempts for ${email}`);
        return res.status(429).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.',
        });
      }

      const isValid = await bcrypt.compare(otp, record.hash);
      if (!isValid) {
        record.attempts += 1;
        logger.warn(`[OTP] Invalid OTP attempt ${record.attempts}/${MAX_VERIFY_ATTEMPTS} for ${email}`);
        
        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${MAX_VERIFY_ATTEMPTS - record.attempts} attempts remaining.`,
        });
      }

      // SECURITY: Mark as used and clean up
      record.used = true;
      logger.info(`[OTP] Verified OTP for ${email}`);
      
      // Clean up after successful verification
      setTimeout(() => {
        delete otpStore[email];
      }, 60000); // Delete after 1 minute

      res.json({
        success: true,
        message: 'OTP verified successfully.',
      });
    } catch (error: any) {
      logger.error('[OTP] Verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed. Please try again.',
      });
    }
  }
);

export default router;
