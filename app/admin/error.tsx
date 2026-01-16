'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Admin Route Error Boundary
 * Catches runtime errors in the admin dashboard and provides recovery options
 * Follows Next.js 15 error handling patterns
 */
export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development, could be sent to monitoring service
    console.error('Admin Dashboard Error:', error);
  }, [error]);

  // Determine if this is a network-related error
  const isNetworkError = 
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch');

  // Determine if this is an authentication error
  const isAuthError = 
    error.message.includes('401') ||
    error.message.includes('unauthorized') ||
    error.message.includes('Unauthorized');

  // Determine if this is a permission error
  const isPermissionError = 
    error.message.includes('403') ||
    error.message.includes('forbidden') ||
    error.message.includes('Forbidden');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>

        {/* Error Title */}
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">
          {isAuthError
            ? 'Session Expired'
            : isPermissionError
              ? 'Access Denied'
              : isNetworkError
                ? 'Connection Problem'
                : 'Something Went Wrong'}
        </h1>

        {/* Error Description */}
        <p className="mb-6 text-neutral-600">
          {isAuthError
            ? 'Your session has expired. Please sign in again to continue.'
            : isPermissionError
              ? 'You do not have permission to access this admin resource.'
              : isNetworkError
                ? 'Unable to connect to the server. Please check your internet connection and try again.'
                : 'We encountered an unexpected error. Our team has been notified.'}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 rounded-lg bg-neutral-100 p-4 text-left">
            <p className="mb-1 text-xs font-medium text-neutral-500">Error Details:</p>
            <p className="font-mono text-sm text-error-600">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs text-neutral-400">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {isAuthError ? (
            <Link href="/sign-in">
              <Button variant="primary">
                Sign In Again
              </Button>
            </Link>
          ) : (
            <Button onClick={reset} variant="primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}

          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-neutral-500">
          If this problem persists, please contact{' '}
          <a
            href="mailto:customerservice@totaltravelsolution.com"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            customerservice@totaltravelsolution.com
          </a>
        </p>
      </div>
    </div>
  );
}

