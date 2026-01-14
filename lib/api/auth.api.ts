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
  ForgotPasswordDto,
  ResetPasswordDto,
  SendVerificationOtpDto,
  VerifyEmailDto,
  ResendOtpDto,
  OtpResponse,
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

/**
 * Send password reset OTP to email
 * POST /auth/forgot-password
 */
export const forgotPassword = async (data: ForgotPasswordDto): Promise<OtpResponse> => {
  const response = await apiClient.post<OtpResponse>('/auth/forgot-password', data);
  return response.data;
};

/**
 * Reset password using OTP
 * POST /auth/reset-password
 */
export const resetPassword = async (data: ResetPasswordDto): Promise<OtpResponse> => {
  const response = await apiClient.post<OtpResponse>('/auth/reset-password', data);
  return response.data;
};

/**
 * Send email verification OTP
 * POST /auth/send-verification-otp
 */
export const sendVerificationOtp = async (data: SendVerificationOtpDto): Promise<OtpResponse> => {
  const response = await apiClient.post<OtpResponse>('/auth/send-verification-otp', data);
  return response.data;
};

/**
 * Verify email using OTP
 * POST /auth/verify-email
 */
export const verifyEmail = async (data: VerifyEmailDto): Promise<OtpResponse> => {
  const response = await apiClient.post<OtpResponse>('/auth/verify-email', data);

  // Update user in localStorage to mark email as verified
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        user.isEmailVerified = true;
        localStorage.setItem('user', JSON.stringify(user));
      } catch {
        // Ignore error
      }
    }
  }

  return response.data;
};

/**
 * Resend OTP (for either password reset or email verification)
 * POST /auth/resend-otp
 */
export const resendOtp = async (data: ResendOtpDto): Promise<OtpResponse> => {
  const response = await apiClient.post<OtpResponse>('/auth/resend-otp', data);
  return response.data;
};

