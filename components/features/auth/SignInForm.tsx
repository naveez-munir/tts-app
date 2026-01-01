'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { LoginSchema } from '@/lib/types';

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
      if (error.issues) {
        const fieldErrors: any = {};
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
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="rounded-lg bg-error-50 p-4 text-sm text-error-700">
            {errors.general}
          </div>
        )}

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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
              disabled={isLoading}
            />
            <span className="text-sm text-neutral-700">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-accent-600 hover:text-accent-700 hover:underline"
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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-neutral-500">New here?</span>
          </div>
        </div>

        <div className="space-y-3 text-center text-sm">
          <p className="text-neutral-600">
            <strong>Customers:</strong> Book a journey to create your account automatically
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700 hover:underline"
          >
            Get a quote
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="pt-2">
            <p className="text-neutral-600">
              <strong>Transport Operators:</strong> Join our platform
            </p>
            <Link
              href="/operators/register"
              className="inline-flex items-center gap-2 font-semibold text-accent-600 hover:text-accent-700 hover:underline"
            >
              Register as operator
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

