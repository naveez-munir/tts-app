'use client';

import { useState, useEffect } from 'react';
import {
  Gavel,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { bidApi } from '@/lib/api';
import type { Bid } from '@/lib/types';

type BidWithJob = Bid & {
  job?: {
    booking?: {
      bookingReference: string;
      pickupAddress: string;
      dropoffAddress: string;
      pickupDatetime: string;
      customerPrice: number;
      vehicleType: string;
    };
  };
};

export default function MyBidsContent() {
  const [bids, setBids] = useState<BidWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingBid, setWithdrawingBid] = useState<string | null>(null);

  const fetchBids = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bidApi.getOperatorBids();
      setBids(data as BidWithJob[]);
    } catch (err) {
      setError('Failed to load your bids. Please try again.');
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleWithdrawBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to withdraw this bid?')) return;

    setWithdrawingBid(bidId);
    try {
      await bidApi.withdrawBid(bidId);
      await fetchBids();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw bid');
    } finally {
      setWithdrawingBid(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBidStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'WON':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'LOST':
      case 'WITHDRAWN':
        return 'error';
      default:
        return 'default';
    }
  };

  const getBidStatusIcon = (status: string) => {
    switch (status) {
      case 'WON':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'LOST':
      case 'WITHDRAWN':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Group bids by status
  const pendingBids = bids.filter((b) => b.status === 'PENDING');
  const wonBids = bids.filter((b) => b.status === 'WON');
  const otherBids = bids.filter((b) => ['LOST', 'WITHDRAWN'].includes(b.status));

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
        <Button onClick={fetchBids} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const renderBidCard = (bid: BidWithJob) => {
    const booking = bid.job?.booking;
    const bidAmount = parseFloat(String(bid.bidAmount));

    return (
      <div
        key={bid.id}
        className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <span className="font-mono text-sm text-neutral-500">
            {booking?.bookingReference || 'N/A'}
          </span>
          <StatusBadge variant={getBidStatusVariant(bid.status)}>
            <span className="flex items-center gap-1">
              {getBidStatusIcon(bid.status)}
              {bid.status}
            </span>
          </StatusBadge>
        </div>

        {booking && (
          <div className="mb-3 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
              <p className="text-sm text-neutral-700">{booking.pickupAddress}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-sm text-neutral-700">{booking.dropoffAddress}</p>
            </div>
          </div>
        )}

        {booking && (
          <div className="mb-3 flex flex-wrap gap-3 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(booking.pickupDatetime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(booking.pickupDatetime)}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
          <div>
            <p className="text-xs text-neutral-500">Your Bid</p>
            <p className="text-lg font-bold text-neutral-900">£{bidAmount.toFixed(2)}</p>
          </div>
          {bid.status === 'PENDING' && (
            <Button
              onClick={() => handleWithdrawBid(bid.id)}
              disabled={withdrawingBid === bid.id}
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
            >
              {withdrawingBid === bid.id ? 'Withdrawing...' : 'Withdraw Bid'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Bids</h1>
          <p className="mt-1 text-neutral-600">Track all your submitted bids</p>
        </div>
        <Button onClick={fetchBids} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {bids.length === 0 ? (
        <EmptyState
          icon={Gavel}
          title="No bids yet"
          description="You haven't submitted any bids. Check available jobs to start bidding!"
        />
      ) : (
        <div className="space-y-8">
          {/* Pending Bids */}
          {pendingBids.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <Loader2 className="h-5 w-5 animate-spin text-warning-500" />
                Pending Bids ({pendingBids.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {pendingBids.map(renderBidCard)}
              </div>
            </div>
          )}

          {/* Won Bids */}
          {wonBids.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <CheckCircle className="h-5 w-5 text-success-500" />
                Won Bids ({wonBids.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {wonBids.map(renderBidCard)}
              </div>
            </div>
          )}

          {/* Lost/Withdrawn Bids */}
          {otherBids.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <XCircle className="h-5 w-5 text-neutral-400" />
                Past Bids ({otherBids.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {otherBids.map(renderBidCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

