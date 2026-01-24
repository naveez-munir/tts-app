'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/ui/OtpInput';
import { ResetPasswordSchema } from '@/lib/types/auth.types';
import { resetPassword, resendOtp } from '@/lib/api/auth.api';
import { getIcon } from '@/lib/utils/Icons';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    if (!canResend || !email) return;

    try {
      setError('');
      setResendSuccess(false);
      await resendOtp({ email, type: 'PASSWORD_RESET' });
      setCanResend(false);
      setCountdown(60);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Validate data
      const validation = ResetPasswordSchema.safeParse({
        email,
        otp,
        newPassword,
      });

      if (!validation.success) {
        setError(validation.error.issues[0]?.message || 'Invalid data');
        setIsLoading(false);
        return;
      }

      // Reset password
      await resetPassword({ email, otp, newPassword });
      setSuccess(true);

      // Redirect to sign-in page
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to reset password. Please try again.');
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
              Reset Your Password
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
              Enter the 6-digit code we sent to <strong>{email}</strong> and create a new password.
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
                  Password Reset Successful!
                </h2>
                <p className="text-sm text-neutral-600">
                  Your password has been updated. Redirecting you to sign in...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Resend Success Message */}
                {resendSuccess && (
                  <div className="flex items-start gap-3 rounded-lg bg-success-50 p-4 text-sm text-success-700 ring-1 ring-success-200">
                    <span className="h-5 w-5 shrink-0" aria-hidden="true">
                      {getIcon('check-circle')}
                    </span>
                    <span>OTP resent successfully! Check your email.</span>
                  </div>
                )}

                <OtpInput
                  label="6-Digit Code"
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                  autoFocus
                />

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Code expires in 15 minutes</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span>Resend in {countdown}s</span>
                  )}
                </div>

                <div>
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Min 8 characters, 1 uppercase, 1 lowercase, 1 number
                  </p>
                </div>

                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  disabled={isLoading}
                />

                {/* Show/Hide Password Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="showPassword" className="text-sm text-neutral-600">
                    Show password
                  </label>
                </div>

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
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Reset Password Page Content Component with Suspense
 */
export function ResetPasswordPageContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
