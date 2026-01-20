'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import type { User } from '@/lib/types/auth.types';
import { createPaymentIntent, createGroupPaymentIntent } from '@/lib/api/payment.api';
import { getBookingById, getBookingGroupById } from '@/lib/api/booking.api';
import { pollUntil } from '@/lib/utils/polling';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';
import { PollingLoadingState } from './PollingLoadingState';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentSectionProps {
  user: User;
  totalPrice: number;
  bookingId?: string;
  bookingGroupId?: string;
  onSuccess: (paymentIntentId: string) => void;
  isProcessing: boolean;
}

interface PaymentFormProps {
  user: User;
  totalPrice: number;
  bookingId?: string;
  bookingGroupId?: string;
  onSuccess: (paymentIntentId: string) => void;
  isProcessing: boolean;
  clientSecret: string;
  paymentIntentId: string;
}

// Polling configuration
const POLLING_INTERVAL_MS = 2000;
const MAX_POLLING_ATTEMPTS = 30; // 60 seconds total

function PaymentForm({
  user,
  totalPrice,
  bookingId,
  bookingGroupId,
  onSuccess,
  isProcessing,
  clientSecret,
  paymentIntentId,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingAttempt, setPollingAttempt] = useState(0);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      // Confirm the payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        setIsConfirming(false);
        return;
      }

      // Payment confirmed with Stripe - now poll for webhook processing
      setIsConfirming(false);
      setIsPolling(true);
      setPollingAttempt(0);

      // Poll for booking status to become PAID (set by webhook)
      const pollResult = await pollUntil({
        fetcher: async () => {
          if (bookingGroupId) {
            const group = await getBookingGroupById(bookingGroupId);
            // Check if all bookings in group are PAID
            const allPaid = group.bookings?.every((b) => b.status === 'PAID') ?? false;
            return { isPaid: allPaid, data: group };
          } else if (bookingId) {
            const booking = await getBookingById(bookingId);
            return { isPaid: booking.status === 'PAID', data: booking };
          }
          throw new Error('No booking ID provided');
        },
        condition: (result) => result.isPaid,
        intervalMs: POLLING_INTERVAL_MS,
        maxAttempts: MAX_POLLING_ATTEMPTS,
        onAttempt: (attempt) => {
          setPollingAttempt(attempt);
        },
      });

      if (pollResult.success) {
        // Booking is confirmed PAID by webhook
        onSuccess(paymentIntentId);
      } else {
        // Polling timed out - payment likely succeeded but webhook delayed
        // Show graceful message and allow user to continue
        setPollingTimedOut(true);
        console.warn('Polling timed out waiting for webhook. Payment may still be processing.');
        // Still call onSuccess after timeout - payment was confirmed by Stripe
        setTimeout(() => {
          onSuccess(paymentIntentId);
        }, 3000);
      }
    } catch (err: unknown) {
      console.error('Payment process failed:', err);
      const errorMessage = getContextualErrorMessage(err, 'payment');
      setError(errorMessage);
      setIsPolling(false);
    }
  };

  // Show polling state
  if (isPolling) {
    return (
      <PollingLoadingState
        attempt={pollingAttempt}
        maxAttempts={MAX_POLLING_ATTEMPTS}
        timedOut={pollingTimedOut}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Info */}
      <div className="rounded-lg bg-neutral-50 p-4">
        <p className="text-sm text-neutral-600">Paying as:</p>
        <p className="font-semibold text-neutral-900">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-neutral-600">{user.email}</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stripe Payment Element */}
      <div className="rounded-lg border border-neutral-200 p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
          }}
        />
      </div>

      {/* Amount Display */}
      <div className="rounded-lg bg-accent-50 p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">Amount to Pay</span>
          <span className="text-2xl font-black text-accent-600">£{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        type="submit"
        variant="accent"
        className="w-full"
        disabled={!stripe || isConfirming || isProcessing}
      >
        {isConfirming || isProcessing ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay £{totalPrice.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Lock className="h-3 w-3" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-xs text-neutral-400">Accepted:</span>
        <div className="flex gap-2">
          <div className="rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
            Visa
          </div>
          <div className="rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
            Mastercard
          </div>
          <div className="rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
            Amex
          </div>
        </div>
      </div>
    </form>
  );
}

export function PaymentSection({
  user,
  totalPrice,
  bookingId,
  bookingGroupId,
  onSuccess,
  isProcessing,
}: PaymentSectionProps) {
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent on mount
  useEffect(() => {
    const initializePayment = async () => {
      setIsCreatingIntent(true);
      setError(null);

      try {
        if (bookingGroupId) {
          // Return journey - use group payment intent
          const result = await createGroupPaymentIntent({
            bookingGroupId,
            amount: totalPrice.toFixed(2),
          });
          setClientSecret(result.clientSecret);
          setPaymentIntentId(result.paymentIntentId);
        } else if (bookingId) {
          // Single journey
          const result = await createPaymentIntent({
            bookingId,
            amount: totalPrice.toFixed(2),
          });
          setClientSecret(result.clientSecret);
          setPaymentIntentId(result.paymentIntentId);
        } else {
          throw new Error('No booking ID provided');
        }
      } catch (err: unknown) {
        console.error('Failed to create payment intent:', err);
        const errorMessage = getContextualErrorMessage(err, 'payment');
        setError(errorMessage);
      } finally {
        setIsCreatingIntent(false);
      }
    };

    initializePayment();
  }, [bookingId, bookingGroupId, totalPrice]);

  // Show loading state while creating payment intent
  if (isCreatingIntent) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <CreditCard className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Payment Details</h2>
            <p className="text-sm text-neutral-600">Secure payment via Stripe</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-sm text-neutral-600">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  // Show error if payment intent creation failed
  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <CreditCard className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Payment Details</h2>
            <p className="text-sm text-neutral-600">Secure payment via Stripe</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Show Stripe payment form
  if (!clientSecret || !paymentIntentId) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
          <CreditCard className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Payment Details</h2>
          <p className="text-sm text-neutral-600">Secure payment via Stripe</p>
        </div>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0F766E',
              colorBackground: '#ffffff',
              colorText: '#171717',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
          },
        }}
      >
        <PaymentForm
          user={user}
          totalPrice={totalPrice}
          bookingId={bookingId}
          bookingGroupId={bookingGroupId}
          onSuccess={onSuccess}
          isProcessing={isProcessing}
          clientSecret={clientSecret}
          paymentIntentId={paymentIntentId}
        />
      </Elements>
    </div>
  );
}

