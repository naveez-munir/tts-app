'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import BookingCard from '@/components/features/dashboard/BookingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getOrganizedBookings } from '@/lib/api';
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
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-500">{label}</p>
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

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrganizedBookings();
      setBookings(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error}</p>
        <button
          onClick={fetchBookings}
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
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={meta?.totalBookings || 0} icon={Calendar} color="blue" />
        <StatCard label="Upcoming" value={upcomingCount} icon={Clock} color="yellow" />
        <StatCard label="Completed" value={completedCount} icon={CheckCircle} color="green" />
        <StatCard label="Cancelled" value={cancelledCount} icon={AlertCircle} color="red" />
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-6">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'one-way', label: `One-Way (${meta?.oneWayCount || 0})` },
            { key: 'return', label: `Return (${meta?.returnJourneyCount || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'all' | 'one-way' | 'return')}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
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

      {/* Bookings List */}
      {displayedBookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Book your first airport transfer to get started."
          action={
            <Link
              href="/quote"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Book Now
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

