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
import { CountdownTimer } from '@/components/admin/jobs/CountdownTimer';
import { useToast } from '@/components/ui/Toast';
import { StopsIndicator } from '@/components/ui/StopsList';
import { jobApi, bidApi } from '@/lib/api';
import { getContextualErrorMessage, extractErrorMessage } from '@/lib/utils/error-handler';
import { getVehicleTypeLabel } from '@/lib/utils/vehicle-type';
import type { Job, Booking, StopResponse } from '@/lib/types';

/**
 * Normalize booking from snake_case API response to camelCase
 */
function normalizeBooking(data: Record<string, unknown>): Booking {
  return {
    id: (data.id as string) || '',
    bookingReference: (data.bookingReference ?? data.booking_reference ?? '') as string,
    customerId: (data.customerId ?? data.customer_id ?? '') as string,
    journeyType: (data.journeyType ?? data.journey_type ?? 'ONE_WAY') as Booking['journeyType'],
    bookingGroupId: (data.bookingGroupId ?? data.booking_group_id ?? null) as string | null,
    linkedBookingId: (data.linkedBookingId ?? data.linked_booking_id ?? null) as string | null,
    status: (data.status ?? 'PENDING') as Booking['status'],
    serviceType: (data.serviceType ?? data.service_type ?? 'POINT_TO_POINT') as Booking['serviceType'],
    pickupAddress: (data.pickupAddress ?? data.pickup_address ?? '') as string,
    pickupPostcode: (data.pickupPostcode ?? data.pickup_postcode ?? '') as string,
    pickupLat: Number(data.pickupLat ?? data.pickup_lat ?? 0),
    pickupLng: Number(data.pickupLng ?? data.pickup_lng ?? 0),
    dropoffAddress: (data.dropoffAddress ?? data.dropoff_address ?? '') as string,
    dropoffPostcode: (data.dropoffPostcode ?? data.dropoff_postcode ?? '') as string,
    dropoffLat: Number(data.dropoffLat ?? data.dropoff_lat ?? 0),
    dropoffLng: Number(data.dropoffLng ?? data.dropoff_lng ?? 0),
    pickupDatetime: (data.pickupDatetime ?? data.pickup_datetime ?? '') as string,
    passengerCount: Number(data.passengerCount ?? data.passenger_count ?? 1),
    luggageCount: Number(data.luggageCount ?? data.luggage_count ?? 0),
    vehicleType: (data.vehicleType ?? data.vehicle_type ?? 'SALOON') as Booking['vehicleType'],
    flightNumber: (data.flightNumber ?? data.flight_number ?? null) as string | null,
    specialRequirements: (data.specialRequirements ?? data.special_requirements ?? data.specialRequests ?? data.special_requests ?? null) as string | null,
    distanceMiles: data.distanceMiles != null ? Number(data.distanceMiles) : (data.distance_miles != null ? Number(data.distance_miles) : null),
    durationMinutes: data.durationMinutes != null ? Number(data.durationMinutes) : (data.duration_minutes != null ? Number(data.duration_minutes) : null),
    customerName: (data.customerName ?? data.customer_name ?? null) as string | null,
    customerEmail: (data.customerEmail ?? data.customer_email ?? null) as string | null,
    customerPhone: (data.customerPhone ?? data.customer_phone ?? null) as string | null,
    terminal: (data.terminal ?? null) as string | null,
    hasMeetAndGreet: Boolean(data.hasMeetAndGreet ?? data.has_meet_and_greet ?? false),
    childSeats: Number(data.childSeats ?? data.child_seats ?? 0),
    boosterSeats: Number(data.boosterSeats ?? data.booster_seats ?? 0),
    stops: (data.stops ?? []) as StopResponse[],
    customerPrice: Number(data.customerPrice ?? data.customer_price ?? data.quotedPrice ?? data.quoted_price ?? 0),
    createdAt: (data.createdAt ?? data.created_at ?? '') as string,
    updatedAt: (data.updatedAt ?? data.updated_at ?? '') as string,
  };
}

/**
 * Normalize job from snake_case API response to camelCase
 */
function normalizeJob(data: Record<string, unknown>): Job {
  const bookingData = data.booking as Record<string, unknown> | undefined;

  return {
    id: (data.id as string) || '',
    bookingId: (data.bookingId ?? data.booking_id ?? '') as string,
    status: (data.status ?? 'PENDING_BIDS') as Job['status'],
    biddingWindowOpensAt: (data.biddingWindowOpensAt ?? data.bidding_window_opens_at ?? '') as string,
    biddingWindowClosesAt: (data.biddingWindowClosesAt ?? data.bidding_window_closes_at ?? '') as string,
    biddingWindowDurationHours: Number(data.biddingWindowDurationHours ?? data.bidding_window_duration_hours ?? 24),
    winningBidId: (data.winningBidId ?? data.winning_bid_id ?? null) as string | null,
    assignedOperatorId: (data.assignedOperatorId ?? data.assigned_operator_id ?? null) as string | null,
    platformMargin: data.platformMargin != null ? Number(data.platformMargin) : (data.platform_margin != null ? Number(data.platform_margin) : null),
    completedAt: (data.completedAt ?? data.completed_at ?? null) as string | null,
    createdAt: (data.createdAt ?? data.created_at ?? '') as string,
    updatedAt: (data.updatedAt ?? data.updated_at ?? '') as string,
    booking: bookingData ? normalizeBooking(bookingData) : undefined,
    bids: data.bids as Job['bids'],
    driverDetails: (data.driverDetails ?? data.driver_details) as Job['driverDetails'],
  };
}

/**
 * Normalize an array of jobs
 */
function normalizeJobs(data: unknown[]): Job[] {
  return data.map((item) => normalizeJob(item as Record<string, unknown>));
}

export default function AvailableJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [submittingBid, setSubmittingBid] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const toast = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobApi.getOperatorAvailableJobs();
      // Normalize snake_case API response to camelCase
      const normalized = normalizeJobs(data as unknown[]);
      setJobs(normalized);
    } catch (err: unknown) {
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
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
      toast.warning('Please enter a valid bid amount');
      return;
    }
    if (parseFloat(amount) > customerPrice) {
      toast.warning(`Your bid cannot exceed the maximum bid of £${customerPrice.toFixed(2)}`);
      return;
    }

    setSubmittingBid(jobId);
    try {
      await bidApi.submitBid({ jobId, bidAmount: amount });
      setBidSuccess(jobId);
      setBidAmounts((prev) => ({ ...prev, [jobId]: '' }));
      toast.success('Bid submitted successfully!');
      // Refresh jobs to show updated bid status
      await fetchJobs();
      setTimeout(() => setBidSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
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
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Jobs</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
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
            View and bid on available transfer jobs
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
                  <CountdownTimer endDate={job.biddingWindowClosesAt} />
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
                  {booking.stops && booking.stops.length > 0 && (
                    <div className="ml-7 flex items-center gap-2">
                      <StopsIndicator count={booking.stops.length} />
                    </div>
                  )}
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
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Briefcase className="h-4 w-4" />
                    {booking.luggageCount} luggage
                  </div>
                  <StatusBadge variant="info">{getVehicleTypeLabel(booking.vehicleType)}</StatusBadge>
                </div>

                {/* Additional Details */}
                <div className="mb-4 space-y-2">
                  {(booking.childSeats > 0 || booking.boosterSeats > 0) && (
                    <div className="rounded-lg bg-warning-50 px-3 py-2">
                      <p className="text-sm font-medium text-warning-700">
                        ⚠️ Child Safety Requirements
                      </p>
                      <div className="mt-1 flex gap-4 text-xs text-warning-600">
                        {booking.childSeats > 0 && <span>{booking.childSeats} child seat(s)</span>}
                        {booking.boosterSeats > 0 && <span>{booking.boosterSeats} booster seat(s)</span>}
                      </div>
                    </div>
                  )}

                  {booking.terminal && (
                    <div className="flex items-start gap-2 text-sm text-neutral-600">
                      <Plane className="mt-0.5 h-4 w-4 text-primary-600" />
                      <span><strong>Terminal:</strong> {booking.terminal}</span>
                    </div>
                  )}

                  {booking.flightNumber && (
                    <div className="flex items-start gap-2 text-sm text-neutral-600">
                      <Plane className="mt-0.5 h-4 w-4 text-primary-600" />
                      <span><strong>Flight:</strong> {booking.flightNumber}</span>
                    </div>
                  )}

                  {booking.hasMeetAndGreet && (
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                        Meet & Greet
                      </span>
                    </div>
                  )}

                  {(booking.distanceMiles || booking.durationMinutes) && (
                    <div className="flex gap-4 text-xs text-neutral-500">
                      {booking.distanceMiles && <span>Distance: {booking.distanceMiles} miles</span>}
                      {booking.durationMinutes && <span>Duration: ~{booking.durationMinutes} min</span>}
                    </div>
                  )}

                  {booking.specialRequirements && (
                    <div className="rounded-lg bg-neutral-50 px-3 py-2">
                      <p className="text-xs font-medium text-neutral-700">Special Requirements:</p>
                      <p className="mt-1 text-xs text-neutral-600">{booking.specialRequirements}</p>
                    </div>
                  )}
                </div>

                {/* Customer Price & Bidding */}
                <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Maximum Bid</p>
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

