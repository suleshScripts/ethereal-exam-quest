import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import logger from '../utils/logger';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const { data: student, error } = await supabase
      .from('students')
      .select('id, email, username, name, phone, avatar_url, created_at')
      .eq('id', req.user!.userId)
      .single();

    if (error || !student) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      user: student,
    });
  } catch (error: any) {
    logger.error('[Get Profile] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const { name, phone, username } = req.body;
    const updates: any = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (username) {
      // Check if username is available
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', req.user!.userId)
        .maybeSingle();

      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Username already taken',
        });
      }
      updates.username = username.toLowerCase();
    }

    const { data: student, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', req.user!.userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update profile',
      });
    }

    res.json({
      success: true,
      user: student,
    });
  } catch (error: any) {
    logger.error('[Update Profile] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get user plans
router.get('/plans', async (req: Request, res: Response) => {
  try {
    const { data: student } = await supabase
      .from('students')
      .select('phone')
      .eq('id', req.user!.userId)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { data: plans, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('student_phone', student.phone)
      .order('purchased_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch plans',
      });
    }

    res.json({
      success: true,
      plans: plans || [],
    });
  } catch (error: any) {
    logger.error('[Get Plans] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get active plans
router.get('/plans/active', async (req: Request, res: Response) => {
  try {
    const { data: student } = await supabase
      .from('students')
      .select('phone')
      .eq('id', req.user!.userId)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const now = new Date().toISOString();
    const { data: plans, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('student_phone', student.phone)
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('purchased_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch active plans',
      });
    }

    res.json({
      success: true,
      plans: plans || [],
    });
  } catch (error: any) {
    logger.error('[Get Active Plans] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get exam history
router.get('/exam-history', async (req: Request, res: Response) => {
  try {
    const { data: student } = await supabase
      .from('students')
      .select('phone')
      .eq('id', req.user!.userId)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { data: results, error } = await supabase
      .from('exam_results')
      .select('*')
      .eq('student_phone', student.phone)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch exam history',
      });
    }

    res.json({
      success: true,
      results: results || [],
    });
  } catch (error: any) {
    logger.error('[Get Exam History] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get exam progress
router.get('/exam-progress/:examId', async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;

    const { data: student } = await supabase
      .from('students')
      .select('phone')
      .eq('id', req.user!.userId)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { data: progress, error } = await supabase
      .from('exam_progress')
      .select('*')
      .eq('student_phone', student.phone)
      .eq('exam_id', examId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch exam progress',
      });
    }

    res.json({
      success: true,
      progress: progress || null,
    });
  } catch (error: any) {
    logger.error('[Get Exam Progress] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
