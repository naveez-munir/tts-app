'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import BookingCard from '@/components/features/dashboard/BookingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { getOrganizedBookings } from '@/lib/api';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';
import type { OrganizedBookings, Booking } from '@/lib/types';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
};

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-neutral-900 sm:text-xl">{value}</p>
          <p className="truncate text-xs text-neutral-500 sm:text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const [bookings, setBookings] = useState<OrganizedBookings | null>(null);
  const [meta, setMeta] = useState<{ oneWayCount: number; returnJourneyCount: number; totalBookings: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'one-way' | 'return'>('all');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrganizedBookings();
      setBookings(result.data);
      setMeta(result.meta);
    } catch (err: unknown) {
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Calculate stats
  const allBookings: Booking[] = bookings
    ? [
        ...bookings.oneWayBookings,
        ...bookings.returnJourneys.flatMap((group) => group.bookings),
      ]
    : [];

  const upcomingCount = allBookings.filter(
    (b) => ['PAID', 'ASSIGNED'].includes(b.status) && new Date(b.pickupDatetime) > new Date()
  ).length;

  const completedCount = allBookings.filter((b) => b.status === 'COMPLETED').length;
  const cancelledCount = allBookings.filter((b) => ['CANCELLED', 'REFUNDED'].includes(b.status)).length;

  // Get displayed bookings based on tab
  const getDisplayedBookings = () => {
    if (!bookings) return [];
    
    switch (activeTab) {
      case 'one-way':
        return bookings.oneWayBookings;
      case 'return':
        return bookings.returnJourneys.flatMap((group) => group.bookings);
      default:
        return allBookings;
    }
  };

  const displayedBookings = getDisplayedBookings().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Bookings</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchBookings} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Grid - 2x2 on mobile, 4 on tablet+ */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={meta?.totalBookings || 0} icon={Calendar} color="blue" />
        <StatCard label="Upcoming" value={upcomingCount} icon={Clock} color="yellow" />
        <StatCard label="Completed" value={completedCount} icon={CheckCircle} color="green" />
        <StatCard label="Cancelled" value={cancelledCount} icon={AlertCircle} color="red" />
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex gap-4 sm:gap-6">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'one-way', label: `One-Way (${meta?.oneWayCount || 0})` },
            { key: 'return', label: `Return (${meta?.returnJourneyCount || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'all' | 'one-way' | 'return')}
              className={`whitespace-nowrap border-b-2 pb-2.5 text-xs font-medium transition-colors sm:text-sm ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List - 1 col mobile, 2 col tablet, 3 col 1024px+ */}
      {displayedBookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Book your first transfer to get started."
          action={
            <Link
              href="/dashboard/book"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Book Now
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

