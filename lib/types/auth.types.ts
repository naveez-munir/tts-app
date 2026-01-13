/**
 * Authentication Types
 * Matches backend DTOs from tts-api/src/auth/dto/
 */

import { z } from 'zod';
import { UserRole } from './enums';

// ============================================================================
// ZOD SCHEMAS (for form validation)
// ============================================================================

export const RegisterSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), { message: 'Must contain uppercase letter' })
    .refine((val) => /[a-z]/.test(val), { message: 'Must contain lowercase letter' })
    .refine((val) => /[0-9]/.test(val), { message: 'Must contain number' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
  role: z.enum(['CUSTOMER', 'OPERATOR', 'ADMIN']).default('CUSTOMER'),

  // Operator-specific fields (required when role is OPERATOR)
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  operatingLicenseNumber: z.string().optional(),
  councilRegistration: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPostcode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  fleetSize: z.number().int().positive().optional(),
});

export const LoginSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
});

export const ResetPasswordSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), { message: 'Must contain uppercase letter' })
    .refine((val) => /[a-z]/.test(val), { message: 'Must contain lowercase letter' })
    .refine((val) => /[0-9]/.test(val), { message: 'Must contain number' }),
});

export const SendVerificationOtpSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
});

export const VerifyEmailSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const ResendOtpSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
  type: z.enum(['PASSWORD_RESET', 'EMAIL_VERIFICATION']),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type SendVerificationOtpDto = z.infer<typeof SendVerificationOtpSchema>;
export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;
export type ResendOtpDto = z.infer<typeof ResendOtpSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string; // Backend returns camelCase (Prisma auto-maps from snake_case)
  lastName: string; // Backend returns camelCase
  phoneNumber: string | null; // Backend returns camelCase
  role: UserRole;
  isEmailVerified: boolean; // Backend returns camelCase
  isActive: boolean; // Backend returns camelCase
  createdAt: string; // Backend returns camelCase
  updatedAt: string; // Backend returns camelCase
}

export interface AuthResponse {
  user: User;
  access_token: string; // Backend returns snake_case
}

export interface RegisterResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  data: AuthResponse;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

