'use client';

import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Calendar,
  AlertCircle,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  Banknote,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getOperatorDashboard } from '@/lib/api';

interface EarningsData {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  recentTransactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'EARNING' | 'PAYOUT';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'PROCESSING';
  description: string;
  createdAt: string;
  bookingReference?: string;
}

export default function EarningsContent() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use dashboard data for now - in production, would have dedicated earnings endpoint
      const dashboard = await getOperatorDashboard();
      // Calculate completed payouts as total earnings minus pending
      const totalEarnings = dashboard.totalEarnings || 0;
      const pendingPayouts = dashboard.pendingPayouts || 0;
      setEarnings({
        totalEarnings,
        pendingPayouts,
        completedPayouts: Math.max(0, totalEarnings - pendingPayouts),
        recentTransactions: [], // No transactions endpoint yet - will be empty for now
      });
    } catch (err) {
      setError('Failed to load earnings data. Please try again.');
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'info' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
        return 'info';
      default:
        return 'warning';
    }
  };

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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error}</p>
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
      <div className="grid gap-4 sm:grid-cols-3">
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
              <p className="text-sm font-medium text-neutral-500">Pending Payouts</p>
              <p className="mt-1 text-2xl font-bold text-warning-600">
                £{(earnings?.pendingPayouts || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-warning-100 p-2.5">
              <Clock className="h-5 w-5 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Completed Payouts</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                £{(earnings?.completedPayouts || 0).toFixed(2)}
              </p>
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

      {/* Recent Transactions */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Transactions</h2>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {(!earnings?.recentTransactions || earnings.recentTransactions.length === 0) ? (
          <div className="p-8">
            <EmptyState
              icon={Wallet}
              title="No transactions yet"
              description="Complete jobs to start earning. Your transactions will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {earnings.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${
                      transaction.type === 'EARNING'
                        ? 'bg-success-100'
                        : 'bg-primary-100'
                    }`}
                  >
                    {transaction.type === 'EARNING' ? (
                      <TrendingUp className="h-4 w-4 text-success-600" />
                    ) : (
                      <Banknote className="h-4 w-4 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(transaction.createdAt)}
                      {transaction.bookingReference && (
                        <span className="font-mono">#{transaction.bookingReference}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'EARNING'
                        ? 'text-success-600'
                        : 'text-neutral-900'
                    }`}
                  >
                    {transaction.type === 'EARNING' ? '+' : '-'}£
                    {transaction.amount.toFixed(2)}
                  </p>
                  <StatusBadge variant={getStatusVariant(transaction.status)} className="mt-1">
                    {transaction.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

