'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ForgotPasswordSchema } from '@/lib/types/auth.types';
import { forgotPassword } from '@/lib/api/auth.api';
import { getIcon } from '@/lib/utils/Icons';

/**
 * Forgot Password Page Content Component
 */
export function ForgotPasswordPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      const validation = ForgotPasswordSchema.safeParse({ email });
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || 'Invalid email');
        setIsLoading(false);
        return;
      }

      // Send OTP request
      await forgotPassword({ email });
      setSuccess(true);

      // Redirect to reset-password page with email
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 lg:justify-center">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Decorative gradient orbs */}
      <div
        className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-32 bottom-1/4 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="container relative mx-auto w-full overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-md">
          {/* Back to Sign In Link */}
          <div className="mb-8">
            <Link
              href="/sign-in"
              className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <span
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              >
                {getIcon('arrow-left')}
              </span>
              Back to Sign In
            </Link>
          </div>

          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Forgot Password?
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
              No worries! Enter your email and we'll send you a 6-digit code to reset your password.
            </p>
          </header>

          {/* Form Card */}
          <div className="w-full rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
            {success ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                  <span className="h-8 w-8 text-success-600">
                    {getIcon('check-circle')}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                  Check Your Email
                </h2>
                <p className="text-sm text-neutral-600">
                  We've sent a 6-digit code to <strong>{email}</strong>. Redirecting you to reset your password...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  disabled={isLoading}
                />

                {error && (
                  <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 text-sm text-error-700 ring-1 ring-error-200">
                    <span className="h-5 w-5 shrink-0" aria-hidden="true">
                      {getIcon('info')}
                    </span>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>

                <div className="text-center text-sm text-neutral-600">
                  Remember your password?{' '}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
