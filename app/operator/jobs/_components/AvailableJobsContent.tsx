'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  AlertCircle,
  RefreshCw,
  Car,
  Plane,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { jobApi, bidApi } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function AvailableJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [submittingBid, setSubmittingBid] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobApi.getOperatorAvailableJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load available jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmitBid = async (jobId: string, customerPrice: number) => {
    const amount = bidAmounts[jobId];
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }
    if (parseFloat(amount) > customerPrice) {
      alert('Bid amount cannot exceed the customer price');
      return;
    }

    setSubmittingBid(jobId);
    try {
      await bidApi.submitBid({ jobId, bidAmount: amount });
      setBidSuccess(jobId);
      setBidAmounts((prev) => ({ ...prev, [jobId]: '' }));
      // Refresh jobs to show updated bid status
      await fetchJobs();
      setTimeout(() => setBidSuccess(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit bid');
    } finally {
      setSubmittingBid(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (closesAt: string) => {
    const now = new Date();
    const closes = new Date(closesAt);
    const diff = closes.getTime() - now.getTime();
    if (diff <= 0) return 'Closed';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
        <Button onClick={fetchJobs} variant="primary">
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
          <h1 className="text-2xl font-bold text-neutral-900">Available Jobs</h1>
          <p className="mt-1 text-neutral-600">
            View and bid on available airport transfer jobs
          </p>
        </div>
        <Button onClick={fetchJobs} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No available jobs"
          description="There are no jobs available in your service area right now. Check back later!"
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const booking = job.booking!;
            const customerPrice = parseFloat(String(booking.customerPrice));
            const isAirport = booking.serviceType?.includes('AIRPORT');
            const hasBid = (job.bids?.length || 0) > 0;

            return (
              <div
                key={job.id}
                className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                {/* Job Header */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isAirport ? (
                      <Plane className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Car className="h-5 w-5 text-neutral-600" />
                    )}
                    <span className="font-mono text-sm text-neutral-500">
                      {booking.bookingReference}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning-500" />
                    <span className="text-sm font-medium text-warning-600">
                      {getTimeRemaining(job.biddingWindowClosesAt)} left
                    </span>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Pickup</p>
                      <p className="text-sm font-medium text-neutral-900">{booking.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Drop-off</p>
                      <p className="text-sm font-medium text-neutral-900">{booking.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Journey Info */}
                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(booking.pickupDatetime)}
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Clock className="h-4 w-4" />
                    {formatTime(booking.pickupDatetime)}
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Users className="h-4 w-4" />
                    {booking.passengerCount} passengers
                  </div>
                  <StatusBadge variant="info">{booking.vehicleType}</StatusBadge>
                </div>

                {/* Customer Price & Bidding */}
                <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Customer Price (Max Bid)</p>
                    <p className="text-xl font-bold text-neutral-900">
                      £{customerPrice.toFixed(2)}
                    </p>
                  </div>

                  {bidSuccess === job.id ? (
                    <div className="rounded-lg bg-success-100 px-4 py-2 text-sm font-medium text-success-700">
                      ✓ Bid submitted successfully!
                    </div>
                  ) : hasBid ? (
                    <div className="rounded-lg bg-accent-100 px-4 py-2 text-sm font-medium text-accent-700">
                      You have already bid on this job
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                          £
                        </span>
                        <Input
                          type="number"
                          placeholder="Your bid"
                          value={bidAmounts[job.id] || ''}
                          onChange={(e) =>
                            setBidAmounts((prev) => ({ ...prev, [job.id]: e.target.value }))
                          }
                          className="w-32 pl-7"
                          step="0.01"
                          min="0"
                          max={customerPrice}
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmitBid(job.id, customerPrice)}
                        disabled={submittingBid === job.id}
                        variant="primary"
                        size="sm"
                      >
                        {submittingBid === job.id ? 'Submitting...' : 'Submit Bid'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

