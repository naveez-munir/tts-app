'use client';

import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Car,
  Plane,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Booking } from '@/lib/types';

interface BookingCardProps {
  booking: Booking;
  showDetails?: boolean;
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

export default function BookingCard({ booking, showDetails = true }: BookingCardProps) {
  const pickupDate = new Date(booking.pickupDatetime);
  const isAirport = booking.serviceType.includes('AIRPORT');

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">Booking Reference</p>
          <p className="font-mono text-sm font-semibold text-neutral-900">
            {booking.bookingReference}
          </p>
        </div>
        <StatusBadge variant={statusVariants[booking.status] || 'default'}>
          {booking.status.replace('_', ' ')}
        </StatusBadge>
      </div>

      {/* Journey Details */}
      <div className="mb-4 space-y-3">
        {/* Pickup */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-green-100 p-1.5">
            <MapPin className="h-3.5 w-3.5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-500">Pickup</p>
            <p className="truncate text-sm text-neutral-900">{booking.pickupAddress}</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="h-4 w-4 rotate-90 text-neutral-300" />
        </div>

        {/* Dropoff */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-red-100 p-1.5">
            <MapPin className="h-3.5 w-3.5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-500">Drop-off</p>
            <p className="truncate text-sm text-neutral-900">{booking.dropoffAddress}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-neutral-50 p-3 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Date</p>
            <p className="text-sm font-medium text-neutral-900">
              {pickupDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Passengers</p>
            <p className="text-sm font-medium text-neutral-900">{booking.passengerCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Luggage</p>
            <p className="text-sm font-medium text-neutral-900">{booking.luggageCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAirport ? (
            <Plane className="h-4 w-4 text-neutral-400" />
          ) : (
            <Car className="h-4 w-4 text-neutral-400" />
          )}
          <div>
            <p className="text-xs text-neutral-500">Vehicle</p>
            <p className="text-sm font-medium text-neutral-900">
              {vehicleLabels[booking.vehicleType] || booking.vehicleType}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-3">
        <div>
          <p className="text-xs text-neutral-500">Total Price</p>
          <p className="text-lg font-bold text-neutral-900">
            £{booking.customerPrice.toFixed(2)}
          </p>
        </div>
        {showDetails && (
          <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

