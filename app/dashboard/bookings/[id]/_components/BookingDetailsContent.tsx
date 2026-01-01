'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getBookingById, cancelBooking } from '@/lib/api';
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
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError('Failed to load booking details.');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(bookingId);
      setBooking((prev) => (prev ? { ...prev, status: BookingStatus.CANCELLED } : null));
      setShowCancelDialog(false);
    } catch (err) {
      console.error('Error cancelling booking:', err);
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = booking && ['PENDING_PAYMENT', 'PAID', 'ASSIGNED'].includes(booking.status);

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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error || 'Booking not found'}</p>
        <Link href="/dashboard" className="text-primary-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const pickupDate = new Date(booking.pickupDatetime);
  const isAirport = booking.serviceType.includes('AIRPORT');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bookings
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Booking Reference</p>
            <p className="font-mono text-xl font-bold text-neutral-900">
              {booking.bookingReference}
            </p>
          </div>
          <StatusBadge variant={statusVariants[booking.status] || 'default'}>
            {booking.status.replace('_', ' ')}
          </StatusBadge>
        </div>

        {/* Service Type Badge */}
        <div className="mt-4 flex items-center gap-2">
          {isAirport ? (
            <Plane className="h-5 w-5 text-primary-600" />
          ) : (
            <Car className="h-5 w-5 text-primary-600" />
          )}
          <span className="text-sm font-medium text-neutral-700">
            {serviceLabels[booking.serviceType] || booking.serviceType}
          </span>
        </div>
      </div>

      {/* Journey Details */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Journey Details</h2>
        
        <div className="space-y-4">
          {/* Pickup */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Pickup Location</p>
              <p className="text-neutral-900">{booking.pickupAddress}</p>
              <p className="text-sm text-neutral-500">{booking.pickupPostcode}</p>
            </div>
          </div>

          {/* Dropoff */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <MapPin className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Drop-off Location</p>
              <p className="text-neutral-900">{booking.dropoffAddress}</p>
              <p className="text-sm text-neutral-500">{booking.dropoffPostcode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date, Time & Vehicle Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-medium text-neutral-500">Date & Time</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-neutral-400" />
              <span className="text-neutral-900">
                {pickupDate.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-neutral-400" />
              <span className="text-neutral-900">
                {pickupDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-medium text-neutral-500">Trip Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-neutral-400" />
              <span className="text-neutral-900">{vehicleLabels[booking.vehicleType]}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-neutral-400" />
              <span className="text-neutral-900">{booking.passengerCount} Passengers</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-neutral-400" />
              <span className="text-neutral-900">{booking.luggageCount} Luggage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Number (if airport service) */}
      {booking.flightNumber && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Plane className="h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm text-neutral-500">Flight Number</p>
              <p className="font-mono font-semibold text-neutral-900">{booking.flightNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Special Requirements */}
      {booking.specialRequirements && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-2 text-sm font-medium text-neutral-500">Special Requirements</h3>
          <p className="text-neutral-900">{booking.specialRequirements}</p>
        </div>
      )}

      {/* Price & Actions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Total Price</p>
            <p className="text-3xl font-bold text-neutral-900">
              £{booking.customerPrice.toFixed(2)}
            </p>
          </div>

          {canCancel && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <XCircle className="h-4 w-4" />
              Cancel Booking
            </button>
          )}
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

