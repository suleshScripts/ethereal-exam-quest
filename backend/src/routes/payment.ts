import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { authenticate } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// Initialize Razorpay with validation
let razorpay: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    logger.info(`[Razorpay] Initializing with Key ID: ${process.env.RAZORPAY_KEY_ID}`);
    logger.info(`[Razorpay] Key Secret length: ${process.env.RAZORPAY_KEY_SECRET.length} chars`);
    
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    logger.info('✅ Razorpay initialized successfully');
  } catch (error: any) {
    logger.error('❌ Razorpay initialization failed:', error.message);
    logger.error('Error details:', error);
  }
} else {
  logger.warn('⚠️ Razorpay keys not configured. Payment will not work.');
  logger.warn(`RAZORPAY_KEY_ID present: ${!!process.env.RAZORPAY_KEY_ID}`);
  logger.warn(`RAZORPAY_KEY_SECRET present: ${!!process.env.RAZORPAY_KEY_SECRET}`);
}

// Create Razorpay order
router.post('/create-order', authenticate, async (req: Request, res: Response) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      logger.error('[Payment] Razorpay not initialized');
      return res.status(503).json({
        success: false,
        error: 'Payment service not configured',
        message: 'Razorpay keys are missing or invalid',
      });
    }

    const { amount, currency = 'INR', planId, planName } = req.body;

    logger.info(`[Payment] Creating order for ${req.user?.email}: ₹${amount}`);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        planId: planId || '',
        planName: planName || '',
        userId: req.user?.userId || '',
        userEmail: req.user?.email || '',
      },
    };

    const order = await razorpay.orders.create(options);

    logger.info(`[Payment] Order created: ${order.id} for user ${req.user?.email}`);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    logger.error('[Payment] Order creation failed:', error);
    logger.error('[Payment] Error name:', error.name);
    logger.error('[Payment] Error message:', error.message);
    logger.error('[Payment] Error stack:', error.stack);
    logger.error('[Payment] Razorpay instance exists:', !!razorpay);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification parameters',
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      logger.info(`[Payment] Payment verified: ${razorpay_payment_id} for user ${req.user?.email}`);
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      logger.warn(`[Payment] Payment verification failed for ${razorpay_payment_id}`);
      
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }
  } catch (error: any) {
    logger.error('[Payment] Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      message: error.message,
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', authenticate, async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at,
      },
    });
  } catch (error: any) {
    logger.error('[Payment] Fetch payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment details',
      message: error.message,
    });
  }
});

export default router;
