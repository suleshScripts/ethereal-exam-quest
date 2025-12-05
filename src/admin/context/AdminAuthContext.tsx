import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import logger from '@/lib/logger';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session from localStorage
    const checkSession = async () => {
      try {
        const adminSessionStr = localStorage.getItem('admin_session');
        const accessToken = localStorage.getItem('access_token');

        if (adminSessionStr && accessToken) {
          const adminSession = JSON.parse(adminSessionStr);
          
          // Verify token is still valid by calling backend
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
          
          try {
            const response = await fetch(`${API_URL}/api/user/profile`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.user) {
                // Session is valid
                setAdmin(adminSession);
                logger.debug('[AdminAuth] Session restored from localStorage');
              } else {
                // Session invalid, clear
                localStorage.removeItem('admin_session');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
              }
            } else {
              // Token expired or invalid, clear
              localStorage.removeItem('admin_session');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            }
          } catch (error) {
            logger.error('[AdminAuth] Error verifying session:', error);
            // Clear invalid session
            localStorage.removeItem('admin_session');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } else {
          // No session, clear local storage
          localStorage.removeItem('admin_session');
        }
      } catch (error) {
        logger.error('[AdminAuth] Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);





  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      logger.debug('[AdminAuth] Starting login for:', email);

      // First, try backend API authentication
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      const result = await response.json();

      if (!result.success || !result.user) {
        logger.error('[AdminAuth] Backend authentication failed');
        setLoading(false);
        return false;
      }

      // Check if user is admin (username is 'admin' or email contains 'admin')
      const isAdmin = 
        result.user.username === 'admin' || 
        result.user.email.toLowerCase().includes('admin') ||
        result.user.name.toLowerCase().includes('admin');

      if (!isAdmin) {
        logger.error('[AdminAuth] User does not have admin privileges');
        setLoading(false);
        return false;
      }

      logger.debug('[AdminAuth] Admin login successful via backend API');

      // Store tokens
      if (result.session) {
        localStorage.setItem('access_token', result.session.access_token);
        localStorage.setItem('refresh_token', result.session.refresh_token);
      }

      const adminUser: AdminUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: 'admin',
      };

      setAdmin(adminUser);
      localStorage.setItem('admin_session', JSON.stringify(adminUser));

      setLoading(false);
      return true;
    } catch (error) {
      logger.error('[AdminAuth] Login exception:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        // Call backend logout
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }

      setAdmin(null);
      localStorage.removeItem('admin_session');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      logger.debug('[AdminAuth] Logout successful');
    } catch (error) {
      logger.error('[AdminAuth] Logout error:', error);
      // Clear tokens anyway
      setAdmin(null);
      localStorage.removeItem('admin_session');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: admin !== null,
        admin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
