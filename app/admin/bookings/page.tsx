'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, ArrowLeftRight } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { listBookings } from '@/lib/api/admin.api';
import { formatDate, formatCurrency } from '@/lib/utils/date';

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  quoted_price: number;
  status: string;
  is_return_journey?: boolean;
  booking_group_id?: string | null;
}

const statusOptions = ['ALL', 'PENDING_PAYMENT', 'PAID', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function BookingsListPage() {
  const router = useRouter();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listBookings({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage,
        limit: 20,
        search: search || undefined,
      });
      // API returns { success, data: { bookings: [...] }, meta }
      setBookings(response.data?.bookings || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Mock data for development
      setBookings([
        { id: '1', booking_reference: 'TTS-ABC123', customer_name: 'John Smith', pickup_location: 'Heathrow T5', dropoff_location: 'Central London', pickup_datetime: '2025-01-25T14:30:00Z', quoted_price: 85.00, status: 'PAID', is_return_journey: false, booking_group_id: 'group-1' },
        { id: '1b', booking_reference: 'TTS-ABC124', customer_name: 'John Smith', pickup_location: 'Central London', dropoff_location: 'Heathrow T5', pickup_datetime: '2025-01-28T10:00:00Z', quoted_price: 80.75, status: 'PAID', is_return_journey: true, booking_group_id: 'group-1' },
        { id: '2', booking_reference: 'TTS-DEF456', customer_name: 'Sarah Jones', pickup_location: 'Gatwick North', dropoff_location: 'Brighton', pickup_datetime: '2025-01-26T09:00:00Z', quoted_price: 65.00, status: 'ASSIGNED', is_return_journey: false, booking_group_id: null },
        { id: '3', booking_reference: 'TTS-GHI789', customer_name: 'Mike Brown', pickup_location: 'Manchester Airport', dropoff_location: 'Leeds City', pickup_datetime: '2025-01-27T18:00:00Z', quoted_price: 120.00, status: 'COMPLETED', is_return_journey: false, booking_group_id: null },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const columns: Column<Booking>[] = [
    {
      key: 'booking_reference',
      header: 'Reference',
      className: 'font-mono',
      render: (booking) => (
        <div className="flex items-center gap-2">
          <span>{booking.booking_reference}</span>
          {booking.is_return_journey && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary-100 text-secondary-700 rounded text-xs">
              <ArrowLeftRight className="w-3 h-3" /> Return
            </span>
          )}
          {booking.booking_group_id && !booking.is_return_journey && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
              <ArrowLeftRight className="w-3 h-3" /> +Return
            </span>
          )}
        </div>
      ),
    },
    { key: 'customer_name', header: 'Customer' },
    {
      key: 'pickup_location',
      header: 'Route',
      render: (booking) => (
        <div className="max-w-xs">
          <p className="truncate">{booking.pickup_location}</p>
          <p className="text-xs text-neutral-500 truncate">→ {booking.dropoff_location}</p>
        </div>
      ),
    },
    {
      key: 'pickup_datetime',
      header: 'Pickup Date',
      sortable: true,
      render: (booking) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          {formatDate(booking.pickup_datetime)}
        </div>
      ),
    },
    {
      key: 'quoted_price',
      header: 'Price',
      render: (booking) => formatCurrency(booking.quoted_price),
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

