'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar, { type NavItem } from './DashboardSidebar';
import DashboardTopBar, { type TopBarAction } from './DashboardTopBar';
import type { LucideIcon } from 'lucide-react';
import { sendVerificationOtp, verifyEmail, resendOtp } from '@/lib/api/auth.api';
import { VerifyEmailSchema } from '@/lib/types/auth.types';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/ui/OtpInput';
import { getIcon } from '@/lib/utils/Icons';
import { Mail, ShieldCheck } from 'lucide-react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Navigation items for the sidebar */
  navItems: NavItem[];
  /** Branding configuration */
  branding: {
    icon: LucideIcon;
    title: string;
    href: string;
  };
  /** Footer navigation items (e.g., Settings) */
  footerItems?: NavItem[];
  /** Top bar title (shown on desktop) */
  topBarTitle?: string;
  /** Top bar action buttons */
  topBarActions?: TopBarAction[];
  /** Show notifications bell in top bar */
  showNotifications?: boolean;
}

interface UserData {
  email: string;
  role: string;
  isEmailVerified: boolean;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
}

export default function DashboardLayout({
  children,
  navItems,
  branding,
  footerItems,
  topBarTitle,
  topBarActions,
  showNotifications = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | undefined>();

  // Email verification state
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData: UserData = JSON.parse(userStr);
        const name = `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim() || 'User';
        setUser({
          name,
          email: userData.email || '',
        });

        // Check if email verification is required (only for CUSTOMER and OPERATOR)
        const role = userData.role;
        const isEmailVerified = userData.isEmailVerified;

        if ((role === 'CUSTOMER' || role === 'OPERATOR') && !isEmailVerified) {
          setRequiresVerification(true);
          setUserEmail(userData.email || '');
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Handle manual send OTP (user clicks button)
  const handleSendOtp = async () => {
    if (!userEmail || isSendingOtp) return;

    setIsSendingOtp(true);
    setError('');
    try {
      await sendVerificationOtp({ email: userEmail });
      setOtpSent(true);
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      // If cooldown error, still show the form
      if (err.response?.data?.error?.message?.includes('wait') || err.response?.data?.message?.includes('wait')) {
        setOtpSent(true);
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send verification code');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpSent) {
      setCanResend(true);
    }
  }, [countdown, otpSent]);

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      // Validate OTP
      const validation = VerifyEmailSchema.safeParse({ email: userEmail, otp });
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || 'Invalid OTP');
        setIsVerifying(false);
        return;
      }

      // Verify email via API
      await verifyEmail({ email: userEmail, otp });
      setSuccess(true);

      // After brief delay, hide verification screen
      setTimeout(() => {
        setRequiresVerification(false);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend || !userEmail) return;

    setError('');
    setResendSuccess(false);

    try {
      await resendOtp({ email: userEmail, type: 'EMAIL_VERIFICATION' });
      setCanResend(false);
      setCountdown(60);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to resend code');
    }
  };

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        branding={branding}
        user={user}
        onLogout={handleLogout}
        footerItems={footerItems}
      />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <DashboardTopBar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
          title={topBarTitle}
          actions={topBarActions}
          showNotifications={showNotifications}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {requiresVerification ? (
            <div className="mx-auto max-w-md">
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200 sm:p-8">
                {success ? (
                  // Success state
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                      <ShieldCheck className="h-8 w-8 text-success-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                      Email Verified!
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Your email has been verified successfully. Loading your dashboard...
                    </p>
                  </div>
                ) : (
                  // Verification form
                  <>
                    <div className="mb-6 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                        <Mail className="h-7 w-7 text-primary-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-900">
                        Verify Your Email
                      </h2>
                      <p className="mt-2 text-sm text-neutral-600">
                        {otpSent ? (
                          <>
                            We&apos;ve sent a 6-digit code to{' '}
                            <strong className="text-neutral-800">{userEmail}</strong>
                          </>
                        ) : (
                          <>
                            Please verify your email to access your dashboard.
                            <span className="mt-1 block">
                              We&apos;ll send a verification code to{' '}
                              <strong className="text-neutral-800">{userEmail}</strong>
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Initial state - Send Verification Code button */}
                    {!otpSent && !isSendingOtp && !error && (
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={handleSendOtp}
                      >
                        Send Verification Code
                      </Button>
                    )}

                    {/* Loading state for OTP send */}
                    {isSendingOtp && (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                        <p className="text-sm text-neutral-600">Sending verification code...</p>
                      </div>
                    )}

                    {/* Verification form */}
                    {otpSent && !isSendingOtp && (
                      <form onSubmit={handleVerify} className="space-y-5">
                        {/* Resend Success */}
                        {resendSuccess && (
                          <div className="flex items-start gap-3 rounded-lg bg-success-50 p-4 text-sm text-success-700 ring-1 ring-success-200">
                            <span className="h-5 w-5 shrink-0" aria-hidden="true">
                              {getIcon('check-circle')}
                            </span>
                            <span>Code resent successfully! Check your email.</span>
                          </div>
                        )}

                        {/* Error */}
                        {error && (
                          <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 text-sm text-error-700 ring-1 ring-error-200">
                            <span className="h-5 w-5 shrink-0" aria-hidden="true">
                              {getIcon('info')}
                            </span>
                            <span>{error}</span>
                          </div>
                        )}

                        {/* OTP Input */}
                        <OtpInput
                          label="Verification Code"
                          value={otp}
                          onChange={setOtp}
                          autoFocus
                        />

                        {/* Verify Button */}
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={isVerifying || otp.length !== 6}
                        >
                          {isVerifying ? (
                            <>
                              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Verifying...
                            </>
                          ) : (
                            'Verify Email'
                          )}
                        </Button>

                        {/* Resend */}
                        <div className="text-center text-sm">
                          <span className="text-neutral-500">Didn&apos;t receive the code? </span>
                          {canResend ? (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="font-semibold text-primary-600 hover:text-primary-700"
                            >
                              Resend Code
                            </button>
                          ) : (
                            <span className="text-neutral-400">
                              Resend in {countdown}s
                            </span>
                          )}
                        </div>
                      </form>
                    )}

                    {/* Error on initial send */}
                    {!isSendingOtp && !otpSent && error && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 text-sm text-error-700 ring-1 ring-error-200">
                          <span className="h-5 w-5 shrink-0" aria-hidden="true">
                            {getIcon('info')}
                          </span>
                          <span>{error}</span>
                        </div>
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleSendOtp}
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

