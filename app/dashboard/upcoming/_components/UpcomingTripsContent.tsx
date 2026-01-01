'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import BookingCard from '@/components/features/dashboard/BookingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getOrganizedBookings } from '@/lib/api';
import type { Booking } from '@/lib/types';

export default function UpcomingTripsContent() {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrganizedBookings();
      const allBookings = [
        ...result.data.oneWayBookings,
        ...result.data.returnJourneys.flatMap((group) => group.bookings),
      ];

      // Filter for upcoming bookings (PAID or ASSIGNED status with future pickup date)
      const now = new Date();
      const upcoming = allBookings
        .filter(
          (b) =>
            ['PAID', 'ASSIGNED', 'IN_PROGRESS'].includes(b.status) &&
            new Date(b.pickupDatetime) > now
        )
        .sort((a, b) => new Date(a.pickupDatetime).getTime() - new Date(b.pickupDatetime).getTime());

      setUpcomingBookings(upcoming);
    } catch (err) {
      setError('Failed to load upcoming trips. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  // Group bookings by date
  const groupedByDate = upcomingBookings.reduce(
    (acc, booking) => {
      const dateKey = new Date(booking.pickupDatetime).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(booking);
      return acc;
    },
    {} as Record<string, Booking[]>
  );

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
        <button
          onClick={fetchUpcomingBookings}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Upcoming Trips</h1>
        <p className="mt-1 text-neutral-600">
          Your scheduled airport transfers and journeys
        </p>
      </div>

      {/* Summary Card */}
      {upcomingBookings.length > 0 && (
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-2">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-primary-900">
                {upcomingBookings.length} upcoming {upcomingBookings.length === 1 ? 'trip' : 'trips'}
              </p>
              <p className="text-sm text-primary-700">
                Next trip:{' '}
                {new Date(upcomingBookings[0].pickupDatetime).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Bookings */}
      {upcomingBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming trips"
          description="You don't have any scheduled trips. Book your next airport transfer now!"
          action={
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Book a Trip
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, bookings]) => (
            <div key={date}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <Calendar className="h-5 w-5 text-neutral-400" />
                {date}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

