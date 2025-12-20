/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { apiClient, setAuthToken, clearAuth } from './client';
import type {
  RegisterDto,
  LoginDto,
  RegisterResponse,
  LoginResponse,
  User,
} from '@/lib/types';

// ============================================================================
// AUTH API ENDPOINTS
// ============================================================================

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (data: RegisterDto): Promise<User> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register', data);
  return response.data.data;
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (data: LoginDto): Promise<{ user: User; accessToken: string }> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);

  // Store token and user data
  const { user, access_token } = response.data.data;
  setAuthToken(access_token);

  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));

    // Also set cookie for server-side auth checks (middleware/layouts)
    // Cookie expires in 7 days (same as JWT typically)
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `token=${access_token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    // Store user role in cookie for middleware route protection
    document.cookie = `userRole=${user.role}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  return { user, accessToken: access_token };
};

/**
 * Logout user (client-side only)
 */
export const logout = (): void => {
  clearAuth();

  // Clear auth cookies
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirect to home page
    window.location.href = '/';
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

