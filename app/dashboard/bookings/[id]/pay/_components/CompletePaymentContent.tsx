'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getBookingById } from '@/lib/api/booking.api';
import { createPaymentIntent, confirmPayment } from '@/lib/api/payment.api';
import type { Booking } from '@/lib/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CompletePaymentContentProps {
  bookingId: string;
}

interface PaymentFormProps {
  booking: Booking;
  clientSecret: string;
  paymentIntentId: string;
  onSuccess: () => void;
}

function PaymentForm({ booking, clientSecret, paymentIntentId, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Confirm with backend
      await confirmPayment({
        bookingId: booking.id,
        paymentIntentId,
      });

      onSuccess();
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay £{booking.customerPrice.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-neutral-500">
        <Lock className="mr-1 inline h-3 w-3" />
        Secured by Stripe. Your payment details are encrypted.
      </p>
    </form>
  );
}

export default function CompletePaymentContent({ bookingId }: CompletePaymentContentProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Fetch booking
        const bookingData = await getBookingById(bookingId);
        
        if (bookingData.status !== 'PENDING_PAYMENT') {
          setError('This booking does not require payment.');
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // Create payment intent
        const paymentData = await createPaymentIntent({
          bookingId: bookingData.id,
          amount: bookingData.customerPrice.toFixed(2),
        });

        setClientSecret(paymentData.clientSecret);
        setPaymentIntentId(paymentData.paymentIntentId);
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError('Failed to load booking. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [bookingId]);

  const handleSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      router.push(`/dashboard/bookings/${bookingId}`);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
          <CheckCircle className="h-10 w-10 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Payment Successful!</h1>
        <p className="mt-2 text-neutral-600">
          Your booking has been confirmed. Redirecting to booking details...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error || 'Booking not found'}</p>
        <Link href="/dashboard" className="text-primary-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const pickupDate = new Date(booking.pickupDatetime);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href={`/dashboard/bookings/${bookingId}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Booking
      </Link>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Complete Your Payment</h1>
        <p className="mt-2 text-neutral-600">
          Booking Reference: <span className="font-mono font-semibold">{booking.bookingReference}</span>
        </p>
      </div>

      {/* Two-column layout for larger screens */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Booking Summary - Left column on desktop */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 lg:order-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Booking Summary</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Pickup</p>
                <p className="mt-0.5 text-sm text-neutral-900">{booking.pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <MapPin className="h-4 w-4 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Drop-off</p>
                <p className="mt-0.5 text-sm text-neutral-900">{booking.dropoffAddress}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-neutral-50 p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-900">
                  {pickupDate.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-900">
                  {pickupDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-neutral-700">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">
                £{booking.customerPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form - Right column on desktop */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 lg:order-2">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Payment Details</h2>
          </div>

          {clientSecret && paymentIntentId ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                  },
                },
              }}
            >
              <PaymentForm
                booking={booking}
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                onSuccess={handleSuccess}
              />
            </Elements>
          ) : (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

