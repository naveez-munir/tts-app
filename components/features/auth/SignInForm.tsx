'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { LoginSchema } from '@/lib/types';
import { getIcon } from '@/lib/utils/Icons';

export function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = LoginSchema.parse({
        email: formData.email,
        password: formData.password,
      });

      const { user } = await authApi.login(validatedData);

      if (user.role === 'CUSTOMER') {
        router.push('/dashboard');
      } else if (user.role === 'OPERATOR') {
        router.push('/operator/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin');
      }
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.issues) {
        const fieldErrors: any = {};
        error.issues.forEach((issue: any) => {
          const field = issue.path[0];
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      }
      // Handle API errors (AxiosError)
      else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error.message || 'Invalid email or password' });
      }
      // Handle network errors
      else if (error.error) {
        setErrors({ general: error.error.message || 'Unable to connect to the server' });
      }
      // Fallback
      else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {errors.general && (
        <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 text-sm text-error-700 ring-1 ring-error-200">
          <span className="h-5 w-5 shrink-0" aria-hidden="true">
            {getIcon('info')}
          </span>
          <span>{errors.general}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          disabled={isLoading}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          disabled={isLoading}
          required
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="group flex cursor-pointer items-center gap-2.5 py-1">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            disabled={isLoading}
          />
          <span className="text-sm text-neutral-600 transition-colors group-hover:text-neutral-900">
            Remember me
          </span>
        </label>

        <Link
          href="/forgot-password"
          className="rounded-md px-2 py-1.5 text-sm font-medium text-accent-600 transition-colors hover:text-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      {/* Divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 font-medium uppercase tracking-wide text-neutral-400">
            New here?
          </span>
        </div>
      </div>

      {/* Registration Links */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Customer Option */}
        <Link
          href="/quote#quote-form"
          className="group flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center transition-all hover:border-primary-300 hover:bg-primary-50"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
            <span className="h-5 w-5" aria-hidden="true">
              {getIcon('calendar')}
            </span>
          </div>
          <span className="text-xs font-medium text-neutral-500">Customers</span>
          <span className="mt-0.5 text-sm font-semibold text-neutral-900">Get a Quote</span>
          <span className="mt-1 text-xs text-neutral-500">Account created automatically</span>
        </Link>

        {/* Operator Option */}
        <Link
          href="/operators/register"
          className="group flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center transition-all hover:border-accent-300 hover:bg-accent-50"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-accent-600 transition-colors group-hover:bg-accent-200">
            <span className="h-5 w-5" aria-hidden="true">
              {getIcon('users')}
            </span>
          </div>
          <span className="text-xs font-medium text-neutral-500">Operators</span>
          <span className="mt-0.5 text-sm font-semibold text-neutral-900">Join Platform</span>
          <span className="mt-1 text-xs text-neutral-500">Register your fleet</span>
        </Link>
      </div>
    </form>
  );
}

