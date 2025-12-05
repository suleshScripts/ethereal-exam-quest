// server.js
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const path = require("path");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in dev, set specific in production
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

// Basic in-memory OTP store + rate-limit counters (for demo only)
const otpStore = {}; // { email: { hash, expiresAt, used } }
const sendCooldown = {}; // { email: timestampOfNextAllowedSend }

// Validate env
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("ERROR: EMAIL_USER and EMAIL_PASS must be set in .env");
  process.exit(1);
}

// Create transporter for Gmail app-password (secure)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter on startup to get clear errors
transporter.verify().then(() => {
  console.log("✅ SMTP ready — transporter verified.");
}).catch(err => {
  console.error("❌ SMTP verification failed. Check EMAIL_USER / EMAIL_PASS and 2FA/App Passwords.");
  console.error(err.message || err);
  // keep server running for debugging but warn user
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/send-otp", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    
    // Use provided name or default to generic greeting
    const userName = name || "User";

    // simple cooldown: allow 1 send per 30 seconds per email
    const now = Date.now();
    const nextAllowed = sendCooldown[email] || 0;
    if (now < nextAllowed) {
      const wait = Math.ceil((nextAllowed - now) / 1000);
      return res.status(429).json({ success: false, message: `Wait ${wait}s before requesting another OTP.` });
    }

    const otp = generateOTP();
    const hash = await bcrypt.hash(otp, 10);

    otpStore[email] = {
      hash,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      used: false
    };

    // set cooldown
    sendCooldown[email] = Date.now() + 30 * 1000; // 30 seconds

const mailOptions = {
  from: `"DMLT Academy" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your Verification Code - DMLT Academy",
  html: `
  <div style="margin:0;padding:0;background:#f4f5f7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" 
      style="background:#f4f5f7;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td align="center">

          <!-- Outer Card -->
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" 
            style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Hero Section with Background -->
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

            <!-- Body -->
            <tr>
              <td style="padding:30px 40px;color:#333333;">

                <p style="font-size:16px;margin:0 0 20px 0;">
                  Hi <strong>${userName}</strong>,
                </p>

                <p style="font-size:15px;line-height:1.6;margin:0 0 25px;">
                  Your verification code for <strong>DMLT Academy</strong> is:
                </p>

                <!-- OTP Box -->
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

            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;padding:18px;text-align:center;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} DMLT Academy. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>`
};


    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("send-otp error:", err?.message || err);
    return res.status(500).json({ success: false, message: "Failed to send OTP. Check server logs." });
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required." });

    const record = otpStore[email];
    if (!record) return res.status(404).json({ success: false, message: "No OTP found for that email." });
    if (record.used) return res.status(400).json({ success: false, message: "OTP already used." });
    if (Date.now() > record.expiresAt) return res.status(400).json({ success: false, message: "OTP expired." });

    const isValid = await bcrypt.compare(otp, record.hash);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid OTP." });

    record.used = true; // one-time use
    // Optionally, you can delete otpStore[email] here to free memory:
    // delete otpStore[email];

    return res.json({ success: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error("verify-otp error:", err?.message || err);
    return res.status(500).json({ success: false, message: "Verification failed. Check server logs." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`OTP Server running on ${PORT}`);
});
