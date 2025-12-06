import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase';
import logger from '../utils/logger';

const router = express.Router();

// In-memory verification store (use Redis in production)
const verificationStore: Record<string, {
  code_hash: string;
  expiresAt: number;
  used: boolean;
  attempts: number;
  createdAt: number;
}> = {};

const sendCooldown: Record<string, number> = {};
const MAX_VERIFY_ATTEMPTS = 3;

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Rate limiting
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many verification requests, please try again later',
});

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code endpoint
router.post(
  '/send-verification-code',
  verificationLimiter,
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

      // Check if user exists
      const { data: user } = await supabase
        .from('students')
        .select('id, email, email_verified')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (user.email_verified) {
        return res.status(400).json({
          success: false,
          message: 'Email already verified',
        });
      }

      // Cooldown check
      const now = Date.now();
      const nextAllowed = sendCooldown[email] || 0;
      if (now < nextAllowed) {
        const wait = Math.ceil((nextAllowed - now) / 1000);
        return res.status(429).json({
          success: false,
          message: `Wait ${wait}s before requesting another code.`,
        });
      }

      const code = generateVerificationCode();
      const code_hash = await bcrypt.hash(code, 10);

      verificationStore[email] = {
        code_hash,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        used: false,
        attempts: 0,
        createdAt: Date.now(),
      };

      sendCooldown[email] = Date.now() + 60 * 1000; // 60 seconds

      const mailOptions = {
        from: `"DMLT Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - DMLT Academy',
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
                        background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding:40px 20px;
                        text-align:center;
                        color:white;">
                        
                        <h1 style="margin:0;font-size:28px;letter-spacing:0.5px;font-weight:700;">
                          Verify Your Email
                        </h1>

                        <p style="margin-top:10px;font-size:15px;opacity:0.9;">
                          Welcome to DMLT Academy!
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:40px;color:#333333;">
                      <p style="font-size:16px;margin:0 0 20px 0;">
                        Hi <strong>${userName}</strong>,
                      </p>

                      <p style="font-size:15px;line-height:1.6;margin:0 0 25px;">
                        Thank you for signing up! Please verify your email address to complete your registration.
                      </p>

                      <p style="font-size:15px;line-height:1.6;margin:0 0 25px;">
                        Your verification code is:
                      </p>

                      <div style="
                        background:#f1f5f9;
                        border:2px solid #667eea;
                        border-radius:8px;
                        padding:20px;
                        text-align:center;
                        font-size:36px;
                        font-weight:700;
                        letter-spacing:6px;
                        color:#667eea;
                        margin-bottom:25px;">
                        ${code}
                      </div>

                      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
                        This code will expire in <strong>10 minutes</strong>.
                      </p>

                      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:30px;">
                        If you didn't create an account, please ignore this email.
                      </p>

                      <p style="font-size:15px;margin:0;">
                        Best regards,<br/>
                        <strong>DMLT Academy Team</strong>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background:#f8fafc;padding:20px;text-align:center;color:#94a3b8;font-size:12px;">
                      © ${new Date().getFullYear()} DMLT Academy. All rights reserved.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>`,
      };

      try {
        await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email send timeout')), 15000)
          )
        ]);
        logger.info(`[Verification] Sent code to ${email}`);
      } catch (emailError: any) {
        logger.error('[Verification] Email failed:', emailError.message);
        logger.warn(`[Verification] Code for ${email}: ${code}`);
      }

      res.json({
        success: true,
        message: 'Verification code sent to your email.',
      });
    } catch (error: any) {
      logger.error('[Verification] Send error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again.',
      });
    }
  }
);

// Verify code endpoint
router.post(
  '/verify-email',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
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

      const { email, code } = req.body;

      const record = verificationStore[email];
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'No verification code found for that email.',
        });
      }

      if (record.used) {
        return res.status(400).json({
          success: false,
          message: 'Verification code already used.',
        });
      }

      if (Date.now() > record.expiresAt) {
        delete verificationStore[email];
        return res.status(400).json({
          success: false,
          message: 'Verification code expired.',
        });
      }

      if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
        delete verificationStore[email];
        logger.warn(`[Verification] Too many failed attempts for ${email}`);
        return res.status(429).json({
          success: false,
          message: 'Too many failed attempts. Please request a new code.',
        });
      }

      const isValid = await bcrypt.compare(code, record.code_hash);
      if (!isValid) {
        record.attempts += 1;
        logger.warn(`[Verification] Invalid code attempt ${record.attempts}/${MAX_VERIFY_ATTEMPTS} for ${email}`);

        return res.status(400).json({
          success: false,
          message: `Invalid code. ${MAX_VERIFY_ATTEMPTS - record.attempts} attempts remaining.`,
        });
      }

      // Mark as used
      record.used = true;

      // Update user in database
      const { error: updateError } = await supabase
        .from('students')
        .update({
          email_verified: true,
          is_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase());

      if (updateError) {
        logger.error('[Verification] Database update error:', updateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to verify email. Please try again.',
        });
      }

      logger.info(`[Verification] Email verified for ${email}`);

      // Clean up after successful verification
      setTimeout(() => {
        delete verificationStore[email];
      }, 60000);

      res.json({
        success: true,
        message: 'Email verified successfully!',
      });
    } catch (error: any) {
      logger.error('[Verification] Verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed. Please try again.',
      });
    }
  }
);

export default router;
