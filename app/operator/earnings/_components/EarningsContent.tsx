'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Clock,
  Banknote,
  Loader2,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { getMyEarnings } from '@/lib/api/payout.api';
import { getContextualErrorMessage, isNotFoundError } from '@/lib/utils/error-handler';

interface EarningsData {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  processingPayouts: number;
}

export default function EarningsContent() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyEarnings();
      setEarnings({
        totalEarnings: data?.totalEarnings ?? 0,
        pendingPayouts: data?.pendingPayouts ?? 0,
        completedPayouts: data?.completedPayouts ?? 0,
        processingPayouts: data?.processingPayouts ?? 0,
      });
    } catch (err: unknown) {
      // Handle "Operator profile not found" - show empty earnings instead of error
      if (isNotFoundError(err)) {
        // New operator with no profile/earnings yet - show zeros
        setEarnings({
          totalEarnings: 0,
          pendingPayouts: 0,
          completedPayouts: 0,
          processingPayouts: 0,
        });
      } else {
        const errorMessage = getContextualErrorMessage(err, 'fetch');
        setError(errorMessage);
        console.error('Error fetching earnings:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Earnings</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchEarnings} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Earnings</h1>
          <p className="mt-1 text-neutral-600">Track your income and payouts</p>
        </div>
        <Button onClick={fetchEarnings} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Earnings</p>
              <p className="mt-1 text-2xl font-bold text-success-600">
                £{(earnings?.totalEarnings || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-success-100 p-2.5">
              <TrendingUp className="h-5 w-5 text-success-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-warning-600">
                £{(earnings?.pendingPayouts || 0).toFixed(2)}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">Awaiting payout</p>
            </div>
            <div className="rounded-lg bg-warning-100 p-2.5">
              <Clock className="h-5 w-5 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-200 bg-accent-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-700">Processing</p>
              <p className="mt-1 text-2xl font-bold text-accent-700">
                £{(earnings?.processingPayouts || 0).toFixed(2)}
              </p>
              <p className="mt-0.5 text-xs text-accent-600">Being transferred</p>
            </div>
            <div className="rounded-lg bg-accent-100 p-2.5">
              <Loader2 className="h-5 w-5 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Paid Out</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                £{(earnings?.completedPayouts || 0).toFixed(2)}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">Completed</p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-2.5">
              <CheckCircle className="h-5 w-5 text-neutral-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payout Schedule Info */}
      <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
        <div className="flex items-start gap-3">
          <Banknote className="h-5 w-5 flex-shrink-0 text-accent-600" />
          <div>
            <h3 className="font-semibold text-accent-800">Payout Schedule</h3>
            <p className="mt-1 text-sm text-accent-700">
              Payouts are processed weekly on Fridays. Earnings from completed jobs are
              automatically added to your pending balance and transferred to your registered
              bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Payout Breakdown */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Payout Breakdown</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-warning-500" />
              <span className="text-sm text-neutral-700">Awaiting eligibility</span>
            </div>
            <span className="font-medium text-warning-600">
              £{(earnings?.pendingPayouts || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-accent-50 p-3">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 text-accent-500" />
              <span className="text-sm text-neutral-700">Bank transfer in progress</span>
            </div>
            <span className="font-medium text-accent-600">
              £{(earnings?.processingPayouts || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-success-50 p-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-success-500" />
              <span className="text-sm text-neutral-700">Successfully paid</span>
            </div>
            <span className="font-medium text-success-600">
              £{(earnings?.completedPayouts || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

