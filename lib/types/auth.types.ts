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
});

export const LoginSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email format' }
  ),
  password: z.string().min(1, 'Password is required'),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  first_name: string; // Backend returns snake_case
  last_name: string; // Backend returns snake_case
  phone_number: string | null; // Backend returns snake_case
  role: UserRole;
  is_email_verified: boolean; // Backend returns snake_case
  is_active: boolean; // Backend returns snake_case
  created_at: string; // Backend returns snake_case
  updated_at: string; // Backend returns snake_case
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

