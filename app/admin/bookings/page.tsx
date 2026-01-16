'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, ArrowLeftRight, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { listBookings } from '@/lib/api/admin.api';
import { formatDate, formatCurrency } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

// Normalized booking interface (frontend uses camelCase)
interface Booking {
  id: string;
  bookingReference: string;
  customerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDatetime: string;
  customerPrice: number;
  status: string;
  isReturnJourney?: boolean;
  bookingGroupId?: string | null;
}

// Helper to normalize API response (handles both snake_case and camelCase)
function normalizeBooking(raw: Record<string, unknown>): Booking {
  return {
    id: (raw.id as string) || '',
    bookingReference: (raw.bookingReference ?? raw.booking_reference ?? '') as string,
    customerName: (raw.customerName ?? raw.customer_name ?? (raw.customer as Record<string, unknown>)?.firstName ?? '') as string,
    pickupAddress: (raw.pickupAddress ?? raw.pickup_address ?? raw.pickup_location ?? '') as string,
    dropoffAddress: (raw.dropoffAddress ?? raw.dropoff_address ?? raw.dropoff_location ?? '') as string,
    pickupDatetime: (raw.pickupDatetime ?? raw.pickup_datetime ?? '') as string,
    customerPrice: (raw.customerPrice ?? raw.customer_price ?? raw.quoted_price ?? raw.quotedPrice ?? 0) as number,
    status: (raw.status ?? '') as string,
    isReturnJourney: (raw.isReturnJourney ?? raw.is_return_journey ?? false) as boolean,
    bookingGroupId: (raw.bookingGroupId ?? raw.booking_group_id ?? null) as string | null,
  };
}

const statusOptions = ['ALL', 'PENDING_PAYMENT', 'PAID', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function BookingsListPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listBookings({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage,
        limit: 20,
        search: search || undefined,
      });
      // API returns { success, data: { bookings: [...] }, meta }
      const rawBookings = response.data?.bookings || [];
      setBookings(rawBookings.map(normalizeBooking));
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err: unknown) {
      console.error('Failed to fetch bookings:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const columns: Column<Booking>[] = [
    {
      key: 'bookingReference',
      header: 'Reference',
      className: 'font-mono',
      render: (booking) => (
        <div className="flex items-center gap-2">
          <span>{booking.bookingReference}</span>
          {booking.isReturnJourney && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary-100 text-secondary-700 rounded text-xs">
              <ArrowLeftRight className="w-3 h-3" /> Return
            </span>
          )}
          {booking.bookingGroupId && !booking.isReturnJourney && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
              <ArrowLeftRight className="w-3 h-3" /> +Return
            </span>
          )}
        </div>
      ),
    },
    { key: 'customerName', header: 'Customer' },
    {
      key: 'pickupAddress',
      header: 'Route',
      render: (booking) => (
        <div className="max-w-xs">
          <p className="truncate">{booking.pickupAddress}</p>
          <p className="text-xs text-neutral-500 truncate">→ {booking.dropoffAddress}</p>
        </div>
      ),
    },
    {
      key: 'pickupDatetime',
      header: 'Pickup Date',
      sortable: true,
      render: (booking) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          {formatDate(booking.pickupDatetime)}
        </div>
      ),
    },
    {
      key: 'customerPrice',
      header: 'Price',
      render: (booking) => formatCurrency(booking.customerPrice),
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => (
        <StatusBadge variant={getStatusVariant(booking.status)}>
          {booking.status.replace('_', ' ')}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
        <p className="text-neutral-600 mt-1">View and manage all customer bookings</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
          <Button onClick={fetchBookings} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Search by reference, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(b) => b.id}
        isLoading={isLoading}
        emptyTitle="No bookings found"
        emptyDescription="Try adjusting your search or filters"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRowClick={(booking) => router.push(`/admin/bookings/${booking.id}`)}
      />
    </div>
  );
}

