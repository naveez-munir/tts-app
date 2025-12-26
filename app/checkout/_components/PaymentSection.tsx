'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import type { User } from '@/lib/types/auth.types';
import {
  createPaymentIntent,
  createGroupPaymentIntent,
  confirmPayment,
  confirmGroupPayment,
} from '@/lib/api/payment.api';

interface PaymentSectionProps {
  user: User;
  totalPrice: number;
  bookingId?: string;
  bookingGroupId?: string;
  onSuccess: (paymentIntentId: string) => void;
  isProcessing: boolean;
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
  const [isConfirming, setIsConfirming] = useState(false);

  // For demo/development - mock payment flow
  const [mockCardNumber, setMockCardNumber] = useState('');
  const [mockExpiry, setMockExpiry] = useState('');
  const [mockCvc, setMockCvc] = useState('');

  // Note: In production, you would use Stripe Elements here
  // For now, we'll create a mock payment flow that works with the backend mock mode

  const handleCreatePaymentIntent = async () => {
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
    } catch (err) {
      console.error('Failed to create payment intent:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentIntentId) return;

    setIsConfirming(true);
    setError(null);

    try {
      if (bookingGroupId) {
        // Confirm group payment
        await confirmGroupPayment({
          bookingGroupId,
          paymentIntentId,
        });
      } else if (bookingId) {
        // Confirm single payment
        await confirmPayment({
          bookingId,
          paymentIntentId,
        });
      }

      onSuccess(paymentIntentId);
    } catch (err) {
      console.error('Payment confirmation failed:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  // For demo purposes - simulate card validation
  const isCardValid = mockCardNumber.length >= 16 && mockExpiry.length >= 5 && mockCvc.length >= 3;

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

      {/* User Info */}
      <div className="mb-6 rounded-lg bg-neutral-50 p-4">
        <p className="text-sm text-neutral-600">Paying as:</p>
        <p className="font-semibold text-neutral-900">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-sm text-neutral-600">{user.email}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 ring-1 ring-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Mock Card Form - In production, replace with Stripe Elements */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Card Number
          </label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={mockCardNumber}
            onChange={(e) => setMockCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Use 4242 4242 4242 4242 for testing
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={mockExpiry}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                setMockExpiry(value.slice(0, 5));
              }}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              value={mockCvc}
              onChange={(e) => setMockCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="mt-6 rounded-lg bg-accent-50 p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">Amount to Pay</span>
          <span className="text-2xl font-black text-accent-600">£{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        variant="accent"
        className="mt-6 w-full"
        onClick={handleConfirmPayment}
        disabled={!isCardValid || isConfirming || isProcessing}
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
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Lock className="h-3 w-3" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      {/* Accepted Cards */}
      <div className="mt-4 flex items-center justify-center gap-4">
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
    </div>
  );
}

