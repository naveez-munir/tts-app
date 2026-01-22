'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Car,
  Plane,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { StopsList } from '@/components/ui/StopsList';
import { getBookingById, cancelBooking } from '@/lib/api';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';
import type { Booking } from '@/lib/types';
import { BookingStatus } from '@/lib/types';

interface BookingDetailsContentProps {
  bookingId: string;
}

const vehicleLabels: Record<string, string> = {
  SALOON: 'Saloon',
  ESTATE: 'Estate',
  MPV: 'MPV',
  EXECUTIVE: 'Executive',
  MINIBUS: 'Minibus',
};

const serviceLabels: Record<string, string> = {
  AIRPORT_PICKUP: 'Airport Pickup',
  AIRPORT_DROPOFF: 'Airport Drop-off',
  POINT_TO_POINT: 'Point to Point',
};

const statusVariants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  PENDING_PAYMENT: 'warning',
  PAID: 'info',
  ASSIGNED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'default',
};

export default function BookingDetailsContent({ bookingId }: BookingDetailsContentProps) {
  const router = useRouter();
  const toast = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (err: unknown) {
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(bookingId);
      setBooking((prev) => (prev ? { ...prev, status: BookingStatus.CANCELLED } : null));
      setShowCancelDialog(false);
      toast.success('Booking cancelled successfully');
    } catch (err: unknown) {
      console.error('Error cancelling booking:', err);
      const errorMessage = getContextualErrorMessage(err, 'submit');
      toast.error(errorMessage);
      setShowCancelDialog(false);
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = booking && ['PENDING_PAYMENT', 'PAID', 'ASSIGNED'].includes(booking.status);
  const isPendingPayment = booking?.status === 'PENDING_PAYMENT';

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">
            {error ? 'Unable to Load Booking' : 'Booking Not Found'}
          </h2>
          <p className="mt-1 text-neutral-600">{error || 'The booking you requested could not be found.'}</p>
        </div>
        <div className="flex gap-3">
          {error && (
            <Button onClick={fetchBooking} variant="primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pickupDate = new Date(booking.pickupDatetime);
  const isAirport = booking.serviceType.includes('AIRPORT');

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bookings
      </Link>

      {/* Main Content - 2 Column Layout on Desktop */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-4 lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
                  {isAirport ? (
                    <Plane className="h-6 w-6 text-primary-600" />
                  ) : (
                    <Car className="h-6 w-6 text-primary-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Booking Reference</p>
                  <p className="font-mono text-lg font-bold text-neutral-900">
                    {booking.bookingReference}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {serviceLabels[booking.serviceType] || booking.serviceType}
                  </p>
                </div>
              </div>
              <StatusBadge variant={statusVariants[booking.status] || 'default'}>
                {booking.status.replace('_', ' ')}
              </StatusBadge>
            </div>
          </div>

          {/* Journey Details */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Journey Details</h2>
            {booking.stops && booking.stops.length > 0 ? (
              <StopsList
                pickupAddress={booking.pickupAddress}
                dropoffAddress={booking.dropoffAddress}
                stops={booking.stops}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-500">Pickup</p>
                    <p className="truncate text-sm font-medium text-neutral-900">{booking.pickupAddress}</p>
                    <p className="text-xs text-neutral-500">{booking.pickupPostcode}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-500">Drop-off</p>
                    <p className="truncate text-sm font-medium text-neutral-900">{booking.dropoffAddress}</p>
                    <p className="text-xs text-neutral-500">{booking.dropoffPostcode}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date/Time, Trip Details, Flight - Combined Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Date & Time */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-2 text-xs font-semibold text-neutral-500">Date & Time</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-900">
                    {pickupDate.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-900">
                    {pickupDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-2 text-xs font-semibold text-neutral-500">Trip Details</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-900">{vehicleLabels[booking.vehicleType]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-900">{booking.passengerCount} Passengers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-900">{booking.luggageCount} Luggage</span>
                </div>
              </div>
            </div>

            {/* Flight Number */}
            {booking.flightNumber && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <h3 className="mb-2 text-xs font-semibold text-neutral-500">Flight</h3>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary-600" />
                  <span className="font-mono text-sm font-semibold text-neutral-900">
                    {booking.flightNumber}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Service Options */}
          {(booking.childSeats > 0 || booking.boosterSeats > 0 || booking.hasMeetAndGreet) && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold text-neutral-500">Service Options</h3>
              <div className="flex flex-wrap gap-2">
                {booking.childSeats > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700">
                    {booking.childSeats} Child Seat{booking.childSeats > 1 ? 's' : ''}
                  </span>
                )}
                {booking.boosterSeats > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700">
                    {booking.boosterSeats} Booster Seat{booking.boosterSeats > 1 ? 's' : ''}
                  </span>
                )}
                {booking.hasMeetAndGreet && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1.5 text-xs font-medium text-accent-700">
                    Meet & Greet
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Special Requirements */}
          {booking.specialRequirements && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-1 text-xs font-semibold text-neutral-500">Special Requirements</h3>
              <p className="text-sm text-neutral-900">{booking.specialRequirements}</p>
            </div>
          )}
        </div>

        {/* Right Column - Price & Actions (Sticky on Desktop) */}
        <div className="lg:sticky lg:top-4 lg:self-start space-y-4">
          {/* Pending Payment Alert */}
          {isPendingPayment && (
            <div className="rounded-xl border border-warning-300 bg-warning-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-600" />
                <div>
                  <h3 className="font-semibold text-warning-800">Payment Required</h3>
                  <p className="mt-1 text-sm text-warning-700">
                    Your booking is awaiting payment. Please complete the payment to confirm your trip.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <div className="text-center">
              <p className="text-xs text-neutral-500">Total Price</p>
              <p className="text-3xl font-bold text-neutral-900">
                £{booking.customerPrice.toFixed(2)}
              </p>
            </div>

            {/* Complete Payment Button */}
            {isPendingPayment && (
              <Link
                href={`/dashboard/bookings/${bookingId}/pay`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                Complete Payment
              </Link>
            )}

            {canCancel && (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <XCircle className="h-4 w-4" />
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        variant="danger"
        isLoading={cancelling}
      />
    </div>
  );
}

