'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  CheckCircle,
  XCircle,
  Timer,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CountdownTimer } from '@/components/admin/jobs/CountdownTimer';
import { StopsIndicator } from '@/components/ui/StopsList';
import { operatorApi } from '@/lib/api';
import type { JobOffer } from '@/lib/api/operator.api';

export default function JobOffersContent() {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingOffer, setProcessingOffer] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<{ id: string; action: 'accept' | 'decline' } | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await operatorApi.getJobOffers();
      setOffers(data);
    } catch (err) {
      setError('Failed to load job offers. Please try again.');
      console.error('Error fetching job offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAccept = async (bookingReference: string) => {
    setProcessingOffer(bookingReference);
    try {
      await operatorApi.acceptJobOffer(bookingReference);
      setActionSuccess({ id: bookingReference, action: 'accept' });
      // Refresh the list after a short delay
      setTimeout(() => {
        fetchOffers();
        setActionSuccess(null);
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept job offer');
    } finally {
      setProcessingOffer(null);
    }
  };

  const handleDecline = async (bookingReference: string) => {
    if (!confirm('Are you sure you want to decline this job offer? It will be offered to the next operator.')) {
      return;
    }
    setProcessingOffer(bookingReference);
    try {
      await operatorApi.declineJobOffer(bookingReference);
      setActionSuccess({ id: bookingReference, action: 'decline' });
      // Refresh the list after a short delay
      setTimeout(() => {
        fetchOffers();
        setActionSuccess(null);
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to decline job offer');
    } finally {
      setProcessingOffer(null);
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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error}</p>
        <Button onClick={fetchOffers} variant="primary">
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
          <h1 className="text-2xl font-bold text-neutral-900">Job Offers</h1>
          <p className="mt-1 text-neutral-600">
            Jobs awaiting your acceptance. Respond before the deadline!
          </p>
        </div>
        <Button onClick={fetchOffers} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Info Banner */}
      {offers.length > 0 && (
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
          <div className="flex gap-3">
            <Timer className="h-5 w-5 flex-shrink-0 text-accent-600" />
            <div>
              <h3 className="font-semibold text-accent-800">Action Required</h3>
              <p className="mt-1 text-sm text-accent-700">
                You have {offers.length} job offer{offers.length !== 1 ? 's' : ''} waiting for your response.
                Please accept or decline before the deadline expires.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {offers.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No Pending Job Offers"
          description="You don't have any job offers awaiting acceptance. Keep bidding on available jobs!"
          action={
            <Link href="/operator/jobs">
              <Button variant="primary">
                Browse Available Jobs
              </Button>
            </Link>
          }
        />
      )}

      {/* Job Offer Cards */}
      <div className="grid gap-4">
        {offers.map((offer) => (
          <JobOfferCard
            key={offer.id}
            offer={offer}
            onAccept={handleAccept}
            onDecline={handleDecline}
            isProcessing={processingOffer === offer.bookingReference}
            actionSuccess={actionSuccess?.id === offer.bookingReference ? actionSuccess.action : null}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
}

// Separate component for each job offer card
interface JobOfferCardProps {
  offer: JobOffer;
  onAccept: (bookingReference: string) => void;
  onDecline: (bookingReference: string) => void;
  isProcessing: boolean;
  actionSuccess: 'accept' | 'decline' | null;
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
}

function JobOfferCard({
  offer,
  onAccept,
  onDecline,
  isProcessing,
  actionSuccess,
  formatDate,
  formatTime,
}: JobOfferCardProps) {
  const { booking } = offer;

  // Success state
  if (actionSuccess) {
    return (
      <div className={`rounded-xl border-2 p-6 text-center ${
        actionSuccess === 'accept'
          ? 'border-success-300 bg-success-50'
          : 'border-neutral-300 bg-neutral-50'
      }`}>
        <div className="flex flex-col items-center gap-3">
          {actionSuccess === 'accept' ? (
            <>
              <CheckCircle className="h-12 w-12 text-success-500" />
              <h3 className="text-lg font-semibold text-success-800">Job Accepted!</h3>
              <p className="text-sm text-success-600">
                You've successfully accepted this job. Check your assigned jobs to see the details.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-700">Job Declined</h3>
              <p className="text-sm text-neutral-500">
                This job will be offered to the next operator.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent-100 p-2">
            <Timer className="h-5 w-5 text-accent-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">
              {offer.bookingReference}
            </h3>
            <div className="flex items-center gap-2">
              <StatusBadge variant="warning">Awaiting Response</StatusBadge>
              <span className="text-sm text-neutral-500">
                Attempt #{offer.acceptanceAttemptCount || 1}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-500">Your Bid</p>
          <p className="text-xl font-bold text-success-600">
            £{Number(offer.bidAmount).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600">Time to respond:</span>
          <CountdownTimer
            endDate={offer.acceptanceWindowClosesAt}
          />
        </div>
      </div>

      {/* Job Details */}
      <div className="p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Pickup */}
          <div className="flex gap-3">
            <div className="rounded-lg bg-primary-100 p-2">
              <MapPin className="h-4 w-4 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase text-neutral-500">Pickup</p>
              <p className="truncate text-sm font-medium text-neutral-900">{booking.pickupAddress}</p>
              {booking.pickupPostcode && (
                <p className="text-xs text-neutral-500">{booking.pickupPostcode}</p>
              )}
            </div>
          </div>

          {booking.stops && booking.stops.length > 0 && (
            <div className="col-span-2 flex items-center justify-center">
              <StopsIndicator count={booking.stops.length} />
            </div>
          )}

          {/* Dropoff */}
          <div className="flex gap-3">
            <div className="rounded-lg bg-accent-100 p-2">
              <MapPin className="h-4 w-4 text-accent-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase text-neutral-500">Dropoff</p>
              <p className="truncate text-sm font-medium text-neutral-900">{booking.dropoffAddress}</p>
              {booking.dropoffPostcode && (
                <p className="text-xs text-neutral-500">{booking.dropoffPostcode}</p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex gap-3">
            <div className="rounded-lg bg-neutral-100 p-2">
              <Calendar className="h-4 w-4 text-neutral-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">Date & Time</p>
              <p className="text-sm font-medium text-neutral-900">
                {formatDate(booking.pickupDatetime)}
              </p>
              <p className="text-xs text-neutral-500">{formatTime(booking.pickupDatetime)}</p>
            </div>
          </div>

          {/* Passengers & Luggage */}
          <div className="flex gap-3">
            <div className="rounded-lg bg-neutral-100 p-2">
              <Users className="h-4 w-4 text-neutral-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">Passengers</p>
              <p className="text-sm font-medium text-neutral-900">
                {booking.passengerCount} passengers, {booking.luggageCount} bags
              </p>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="flex gap-3">
            <div className="rounded-lg bg-neutral-100 p-2">
              <Car className="h-4 w-4 text-neutral-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">Vehicle</p>
              <p className="text-sm font-medium text-neutral-900 capitalize">
                {booking.vehicleType?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Flight Number */}
          {booking.flightNumber && (
            <div className="flex gap-3">
              <div className="rounded-lg bg-neutral-100 p-2">
                <Plane className="h-4 w-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Flight</p>
                <p className="text-sm font-medium text-neutral-900">{booking.flightNumber}</p>
              </div>
            </div>
          )}

          {/* Terminal */}
          {booking.terminal && (
            <div className="flex gap-3">
              <div className="rounded-lg bg-neutral-100 p-2">
                <Plane className="h-4 w-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Terminal</p>
                <p className="text-sm font-medium text-neutral-900">{booking.terminal}</p>
              </div>
            </div>
          )}

          {/* Distance & Duration */}
          {(booking.distanceMiles || booking.durationMinutes) && (
            <div className="flex gap-3">
              <div className="rounded-lg bg-neutral-100 p-2">
                <MapPin className="h-4 w-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Journey Info</p>
                <p className="text-sm font-medium text-neutral-900">
                  {booking.distanceMiles && `${booking.distanceMiles} miles`}
                  {booking.distanceMiles && booking.durationMinutes && ' • '}
                  {booking.durationMinutes && `~${booking.durationMinutes} min`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Child Safety Requirements */}
        {(booking.childSeats > 0 || booking.boosterSeats > 0) && (
          <div className="mt-4 rounded-lg bg-warning-50 p-3">
            <p className="text-xs font-medium uppercase text-warning-700">⚠️ Child Safety Requirements</p>
            <div className="mt-1 flex gap-4 text-sm text-warning-800">
              {booking.childSeats > 0 && <span>{booking.childSeats} child seat(s)</span>}
              {booking.boosterSeats > 0 && <span>{booking.boosterSeats} booster seat(s)</span>}
            </div>
          </div>
        )}

        {/* Service Badges */}
        {booking.hasMeetAndGreet && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
              Meet & Greet Service
            </span>
          </div>
        )}

        {/* Special Requirements */}
        {booking.specialRequirements && (
          <div className="mt-4 rounded-lg bg-neutral-50 p-3">
            <p className="text-xs font-medium uppercase text-neutral-700">Special Requirements</p>
            <p className="mt-1 text-sm text-neutral-600">{booking.specialRequirements}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-neutral-100 p-4">
        <Button
          onClick={() => onDecline(offer.bookingReference)}
          variant="outline"
          className="flex-1"
          disabled={isProcessing}
        >
          {isProcessing ? <LoadingSpinner size="sm" className="mr-2" /> : <XCircle className="mr-2 h-4 w-4" />}
          Decline
        </Button>
        <Button
          onClick={() => onAccept(offer.bookingReference)}
          variant="primary"
          className="flex-1"
          disabled={isProcessing}
        >
          {isProcessing ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Accept Job
        </Button>
      </div>
    </div>
  );
}

