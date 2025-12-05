import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@/lib/apiService';
import logger from '@/lib/logger';
import { verifyOTP as verifyOTPApi } from '@/lib/otpApiService';
import { supabaseService } from '@/lib/supabaseService';
import { hashPassword } from '@/lib/passwordUtils';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  avatar_url?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthContextType {
  auth: AuthState;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<{ valid: boolean; message: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
}

interface SignUpData {
  fullName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logger.debug('[AuthContext] Initializing auth...');

        if (api.isAuthenticated()) {
          logger.debug('[AuthContext] Access token found, loading profile...');
          await loadUserProfile();
        } else {
          logger.debug('[AuthContext] No access token found');
        }
      } catch (error) {
        logger.error('[AuthContext] Error initializing auth:', error);
        // Clear invalid tokens
        api.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load user profile from backend
  const loadUserProfile = async () => {
    try {
      const response = await api.getProfile();

      if (response.success && response.user) {
        logger.debug('[AuthContext] User profile loaded:', response.user.email);
        setUser(response.user);
      } else {
        logger.error('[AuthContext] Failed to load profile:', response.error);
        setUser(null);
        api.clearTokens();
      }
    } catch (error) {
      logger.error('[AuthContext] Error loading profile:', error);
      setUser(null);
      api.clearTokens();
    }
  };

  // Sign up new user
  const signUp = async (data: SignUpData) => {
    try {
      logger.debug('[AuthContext] Creating new account for:', data.email);

      const response = await api.signup({
        name: data.fullName,
        email: data.email,
        username: data.username,
        phone: data.phone,
        password: data.password,
      });

      if (!response.success) {
        throw new Error(response.error || 'Signup failed');
      }

      // User is automatically logged in after signup
      if (response.user) {
        setUser(response.user);
      }

      logger.debug('[AuthContext] Signup completed successfully');
    } catch (error: any) {
      logger.error('[AuthContext] Signup error:', error);
      throw error;
    }
  };

  // Sign in with email/username and password
  const signIn = async (identifier: string, password: string) => {
    try {
      logger.debug('[AuthContext] Attempting login for:', identifier);

      const response = await api.login(identifier, password);

      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }

      // Load user profile
      if (response.user) {
        setUser(response.user);
      }

      logger.debug('[AuthContext] Login completed successfully');
    } catch (error: any) {
      logger.error('[AuthContext] Login error:', error);
      throw new Error('Invalid email/username or password');
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      logger.debug('[AuthContext] Signing out');
      await api.logout();
      setUser(null);
    } catch (error: any) {
      logger.error('[AuthContext] Sign out error:', error);
      // Clear tokens anyway
      api.clearTokens();
      setUser(null);
    }
  };

  // Refresh user profile (for use after profile updates)
  const refreshUser = async () => {
    if (api.isAuthenticated()) {
      await loadUserProfile();
    }
  };

  // Verify OTP code using custom OTP API
  const verifyOTP = async (email: string, otp: string): Promise<{ valid: boolean; message: string }> => {
    try {
      logger.debug('[AuthContext] Verifying OTP for:', email);
      const response = await verifyOTPApi(email, otp);
      
      if (response.success) {
        return { valid: true, message: 'OTP verified successfully!' };
      } else {
        return { valid: false, message: response.message || 'Invalid OTP' };
      }
    } catch (error: any) {
      logger.error('[AuthContext] OTP verification error:', error);
      return { valid: false, message: error.message || 'Failed to verify OTP' };
    }
  };

  // Reset password after OTP verification
  const resetPassword = async (email: string, newPassword: string): Promise<void> => {
    try {
      logger.debug('[AuthContext] Resetting password for:', email);
      
      // Call backend API to reset password (uses bcrypt)
      const response = await api.resetPassword(email, newPassword);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to reset password');
      }
      
      logger.debug('[AuthContext] Password reset successful');
    } catch (error: any) {
      logger.error('[AuthContext] Password reset error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  const auth: AuthState = {
    isAuthenticated: !!user && api.isAuthenticated(),
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={{ auth, signUp, signIn, signOut, refreshUser, verifyOTP, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
