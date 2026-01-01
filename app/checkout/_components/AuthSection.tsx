'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, User, Mail, Phone } from 'lucide-react';
import { authApi } from '@/lib/api';
import { LoginSchema, RegisterSchema } from '@/lib/types';
import type { User as UserType } from '@/lib/types/auth.types';
import { UserRole } from '@/lib/types/enums';

interface AuthSectionProps {
  onSuccess: (user: UserType) => void;
  defaultEmail?: string;
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultPhone?: string;
}

export function AuthSection({
  onSuccess,
  defaultEmail = '',
  defaultFirstName = '',
  defaultLastName = '',
  defaultPhone = '',
}: AuthSectionProps) {
  // Default to 'create-password' mode (simpler for new users)
  const [mode, setMode] = useState<'create-password' | 'login'>('create-password');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password fields for new user
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login form state (for existing users)
  const [loginData, setLoginData] = useState({
    email: defaultEmail,
    password: '',
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate password match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      setIsLoading(false);
      return;
    }

    try {
      const validatedData = RegisterSchema.parse({
        email: defaultEmail,
        password: password,
        firstName: defaultFirstName,
        lastName: defaultLastName,
        phoneNumber: defaultPhone || undefined,
        role: UserRole.CUSTOMER,
      });

      // Register the user
      await authApi.register(validatedData);

      // Auto-login after registration
      const { user } = await authApi.login({
        email: defaultEmail,
        password: password,
      });

      onSuccess(user);
    } catch (error: any) {
      if (error.issues) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          const field = issue.path[0];
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (error.error) {
        // Check if it's a duplicate email error
        if (error.error.message?.includes('already exists') || error.error.message?.includes('duplicate')) {
          setErrors({ general: 'An account with this email already exists. Please sign in instead.' });
          setMode('login');
        } else {
          setErrors({ general: error.error.message || 'Registration failed' });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = LoginSchema.parse(loginData);
      const { user } = await authApi.login(validatedData);
      onSuccess(user);
    } catch (error: any) {
      if (error.issues) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          const field = issue.path[0];
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (error.error) {
        setErrors({ general: error.error.message || 'Invalid email or password' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200 sm:p-8">
      {/* Error Message */}
      {errors.general && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 ring-1 ring-red-200">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      {mode === 'create-password' ? (
        <>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Lock className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Secure Your Booking</h2>
            </div>
            <p className="text-sm text-neutral-600">
              Create a password to access your bookings and receive updates
            </p>
          </div>

          {/* User Details Summary (pre-filled from quote) */}
          <div className="mb-6 rounded-lg bg-neutral-50 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-700">
                {defaultFirstName} {defaultLastName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-700">{defaultEmail}</span>
            </div>
            {defaultPhone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-700">{defaultPhone}</span>
              </div>
            )}
          </div>

          {/* Password Form */}
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <Input
              type="password"
              label="Create Password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Account...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>

            <p className="text-center text-xs text-neutral-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
            </p>
          </form>

          {/* Existing User Link */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign in here
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Login Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Welcome Back</h2>
            <p className="text-sm text-neutral-600">Sign in to complete your booking</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              error={errors.email}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing In...
                </>
              ) : (
                'Sign In & Continue'
              )}
            </Button>
          </form>

          {/* Back to Register Link */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('create-password')}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Create one now
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

