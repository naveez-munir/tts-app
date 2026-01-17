'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, AlertTriangle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { listJobs, getEscalatedJobs } from '@/lib/api/admin.api';
import { formatDateTime, formatCurrency } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

// Normalized job interface (frontend uses camelCase)
interface Job {
  id: string;
  bookingReference: string;
  pickupAddress: string;
  pickupDatetime: string;
  customerPrice: number;
  status: string;
  bidCount: number;
  winningBid: number | null;
  biddingEndsAt: string;
}

// Helper to normalize API response (handles both snake_case and camelCase)
function normalizeJob(raw: Record<string, unknown>): Job {
  // Handle nested booking object if present
  const booking = raw.booking as Record<string, unknown> | undefined;
  const biddingWindow = raw.biddingWindow as Record<string, unknown> | undefined;

  // Parse customer price (handle string or number)
  const customerPriceRaw = raw.customerPrice ?? raw.customer_price ?? booking?.customerPrice ?? booking?.customer_price ?? 0;
  const customerPrice = typeof customerPriceRaw === 'string' ? parseFloat(customerPriceRaw) : (customerPriceRaw as number);

  // Parse winning bid (handle string or number)
  const winningBidRaw = raw.winningBid ?? raw.winning_bid ?? null;
  const winningBid = winningBidRaw ? (typeof winningBidRaw === 'string' ? parseFloat(winningBidRaw) : (winningBidRaw as number)) : null;

  return {
    id: (raw.id as string) || '',
    bookingReference: (raw.bookingReference ?? raw.booking_reference ?? booking?.bookingReference ?? booking?.booking_reference ?? '') as string,
    pickupAddress: (raw.pickupAddress ?? raw.pickup_address ?? raw.pickup_location ?? booking?.pickupAddress ?? booking?.pickup_address ?? '') as string,
    pickupDatetime: (raw.pickupDatetime ?? raw.pickup_datetime ?? booking?.pickupDatetime ?? booking?.pickup_datetime ?? '') as string,
    customerPrice,
    status: (raw.status ?? '') as string,
    bidCount: (raw.bidsCount ?? raw.bidCount ?? raw.bid_count ?? (raw.bids as unknown[])?.length ?? 0) as number,
    winningBid,
    biddingEndsAt: (
      biddingWindow?.closesAt ??
      biddingWindow?.closes_at ??
      raw.biddingWindowClosesAt ??
      raw.biddingEndsAt ??
      raw.bidding_ends_at ??
      raw.bidding_window_closes_at ??
      ''
    ) as string,
  };
}

const statusOptions = ['ALL', 'OPEN', 'OPEN_FOR_BIDDING', 'BIDDING_CLOSED', 'ASSIGNED', 'COMPLETED', 'NO_BIDS', 'NO_BIDS_RECEIVED'];

export default function JobsListPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [escalatedCount, setEscalatedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [jobsRes, escalatedRes] = await Promise.all([
        listJobs({ status: statusFilter === 'ALL' ? undefined : statusFilter, page: currentPage, limit: 20, search: search || undefined }),
        getEscalatedJobs(),
      ]);
      // API returns { success, data: { jobs: [...] }, meta }
      const rawJobs = jobsRes.data?.jobs || [];
      setJobs(rawJobs.map(normalizeJob));
      setTotalPages(jobsRes.meta?.totalPages || 1);
      // Escalated jobs also returns { data: { jobs: [...] } }
      const rawEscalated = escalatedRes.data?.jobs || [];
      setEscalatedCount(rawEscalated.length);
    } catch (err: unknown) {
      console.error('Failed to fetch jobs:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      setJobs([]);
      setEscalatedCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns: Column<Job>[] = [
    { key: 'bookingReference', header: 'Booking Ref', className: 'font-mono' },
    { key: 'pickupAddress', header: 'Pickup Location', render: (job) => <span className="truncate max-w-xs block">{job.pickupAddress}</span> },
    { key: 'pickupDatetime', header: 'Pickup Time', sortable: true, render: (job) => formatDateTime(job.pickupDatetime) },
    { key: 'customerPrice', header: 'Customer Price', render: (job) => formatCurrency(job.customerPrice) },
    { key: 'bidCount', header: 'Bids', render: (job) => <span className="font-medium">{job.bidCount}</span> },
    { key: 'winningBid', header: 'Winning Bid', render: (job) => job.winningBid ? formatCurrency(job.winningBid) : '-' },
    { key: 'status', header: 'Status', render: (job) => <StatusBadge variant={getStatusVariant(job.status)}>{job.status.replace('_', ' ')}</StatusBadge> },
  ];

  if (error && jobs.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Jobs</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchJobs} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Jobs & Bidding</h1>
        <p className="text-neutral-600 mt-1">Monitor job broadcasts and operator bids</p>
      </div>

      {/* Escalated Jobs Alert */}
      {escalatedCount > 0 && (
        <div className="bg-error-50 border border-error-200 rounded-xl p-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-error-600" />
          <div className="flex-1">
            <p className="font-medium text-error-800">{escalatedCount} Escalated Job{escalatedCount > 1 ? 's' : ''}</p>
            <p className="text-sm text-error-700">Jobs with no bids require attention</p>
          </div>
          <button onClick={() => setStatusFilter('NO_BIDS')} className="px-4 py-2 bg-error-600 text-white rounded-lg text-sm font-medium hover:bg-error-700">
            View Escalated
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input placeholder="Search by booking reference..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={jobs} keyExtractor={(j) => j.id} isLoading={isLoading} emptyTitle="No jobs found" emptyDescription="Try adjusting your filters" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} onRowClick={(job) => router.push(`/admin/jobs/${job.id}`)} />
    </div>
  );
}

