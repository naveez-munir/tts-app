'use client';

import { Loader2, CheckCircle, Clock } from 'lucide-react';

interface PollingLoadingStateProps {
  /** Current polling attempt (1-based) */
  attempt: number;
  /** Maximum number of attempts */
  maxAttempts: number;
  /** Whether polling has timed out */
  timedOut?: boolean;
  /** Custom message to display */
  message?: string;
}

export function PollingLoadingState({
  attempt,
  maxAttempts,
  timedOut = false,
  message,
}: PollingLoadingStateProps) {
  const progress = Math.min((attempt / maxAttempts) * 100, 100);

  if (timedOut) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-neutral-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Payment Received!</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600">
            We&apos;re processing your booking. You&apos;ll receive an email confirmation shortly.
          </p>
          <p className="mt-4 text-xs text-neutral-500">
            You can safely close this page. Your booking has been recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-neutral-200">
      <div className="flex flex-col items-center text-center">
        {/* Animated loader */}
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-neutral-900">
          {message || 'Processing Your Payment...'}
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          This usually takes 5-10 seconds. Please don&apos;t close this page.
        </p>

        {/* Progress bar */}
        <div className="mt-6 w-full max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            Verifying payment with Stripe...
          </p>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
          <svg
            className="h-4 w-4 text-accent-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Your payment is secure</span>
        </div>
      </div>
    </div>
  );
}

