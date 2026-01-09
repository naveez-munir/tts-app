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
  Clock,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StopsIndicator } from '@/components/ui/StopsList';
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
    <div className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4">
      {/* Header - Reference + Status */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Reference</p>
          <p className="truncate font-mono text-sm font-semibold text-neutral-900">
            {booking.bookingReference}
          </p>
        </div>
        <StatusBadge variant={statusVariants[booking.status] || 'default'}>
          {booking.status.replace('_', ' ')}
        </StatusBadge>
      </div>

      {/* Journey - Compact horizontal layout */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
            <MapPin className="h-3 w-3 text-green-600" />
          </div>
          <p className="min-w-0 flex-1 truncate text-sm text-neutral-900">{booking.pickupAddress}</p>
        </div>
        <div className="ml-3 flex items-center gap-1">
          <ArrowRight className="h-3 w-3 rotate-90 text-neutral-300" />
          {booking.stops && booking.stops.length > 0 && (
            <StopsIndicator count={booking.stops.length} className="ml-1" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
            <MapPin className="h-3 w-3 text-red-600" />
          </div>
          <p className="min-w-0 flex-1 truncate text-sm text-neutral-900">{booking.dropoffAddress}</p>
        </div>
      </div>

      {/* Info Grid - Compact 2x2 */}
      <div className="mb-3 grid grid-cols-4 gap-2 rounded-lg bg-neutral-50 px-2 py-2">
        <div className="text-center">
          <Calendar className="mx-auto h-3.5 w-3.5 text-neutral-400" />
          <p className="mt-0.5 text-[10px] text-neutral-500">Date</p>
          <p className="text-xs font-medium text-neutral-900">
            {pickupDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="text-center">
          <Users className="mx-auto h-3.5 w-3.5 text-neutral-400" />
          <p className="mt-0.5 text-[10px] text-neutral-500">Pax</p>
          <p className="text-xs font-medium text-neutral-900">{booking.passengerCount}</p>
        </div>
        <div className="text-center">
          <Briefcase className="mx-auto h-3.5 w-3.5 text-neutral-400" />
          <p className="mt-0.5 text-[10px] text-neutral-500">Bags</p>
          <p className="text-xs font-medium text-neutral-900">{booking.luggageCount}</p>
        </div>
        <div className="text-center">
          {isAirport ? (
            <Plane className="mx-auto h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <Car className="mx-auto h-3.5 w-3.5 text-neutral-400" />
          )}
          <p className="mt-0.5 text-[10px] text-neutral-500">Type</p>
          <p className="text-xs font-medium text-neutral-900">
            {vehicleLabels[booking.vehicleType] || booking.vehicleType}
          </p>
        </div>
      </div>

      {/* Footer - Price + Action */}
      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-2">
        <div>
          <p className="text-[10px] text-neutral-500">Total</p>
          <p className="text-base font-bold text-neutral-900">
            £{booking.customerPrice.toFixed(2)}
          </p>
        </div>
        {showDetails && (
          <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

