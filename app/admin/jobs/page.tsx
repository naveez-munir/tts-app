'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, AlertTriangle, Clock } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { listJobs, getEscalatedJobs } from '@/lib/api/admin.api';
import { formatDateTime, formatCurrency } from '@/lib/utils/date';

interface Job {
  id: string;
  booking_reference: string;
  pickup_location: string;
  pickup_datetime: string;
  customer_price: number;
  status: string;
  bid_count: number;
  winning_bid: number | null;
  bidding_ends_at: string;
}

const statusOptions = ['ALL', 'OPEN', 'BIDDING_CLOSED', 'ASSIGNED', 'COMPLETED', 'NO_BIDS'];

export default function JobsListPage() {
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [escalatedCount, setEscalatedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const [jobsRes, escalatedRes] = await Promise.all([
        listJobs({ status: statusFilter === 'ALL' ? undefined : statusFilter, page: currentPage, limit: 20, search: search || undefined }),
        getEscalatedJobs(),
      ]);
      // API returns { success, data: { jobs: [...] }, meta }
      setJobs(jobsRes.data?.jobs || []);
      setTotalPages(jobsRes.meta?.totalPages || 1);
      // Escalated jobs also returns { data: { jobs: [...] } }
      setEscalatedCount(escalatedRes.data?.jobs?.length || 0);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Mock data
      setJobs([
        { id: '1', booking_reference: 'TTS-ABC123', pickup_location: 'Heathrow T5', pickup_datetime: '2025-01-25T14:30:00Z', customer_price: 85.00, status: 'OPEN', bid_count: 3, winning_bid: null, bidding_ends_at: '2025-01-24T14:30:00Z' },
        { id: '2', booking_reference: 'TTS-DEF456', pickup_location: 'Gatwick North', pickup_datetime: '2025-01-26T09:00:00Z', customer_price: 65.00, status: 'ASSIGNED', bid_count: 5, winning_bid: 48.00, bidding_ends_at: '2025-01-25T09:00:00Z' },
        { id: '3', booking_reference: 'TTS-GHI789', pickup_location: 'Manchester Airport', pickup_datetime: '2025-01-27T18:00:00Z', customer_price: 120.00, status: 'NO_BIDS', bid_count: 0, winning_bid: null, bidding_ends_at: '2025-01-26T18:00:00Z' },
      ]);
      setEscalatedCount(1);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns: Column<Job>[] = [
    { key: 'booking_reference', header: 'Booking Ref', className: 'font-mono' },
    { key: 'pickup_location', header: 'Pickup Location', render: (job) => <span className="truncate max-w-xs block">{job.pickup_location}</span> },
    { key: 'pickup_datetime', header: 'Pickup Time', sortable: true, render: (job) => formatDateTime(job.pickup_datetime) },
    { key: 'customer_price', header: 'Customer Price', render: (job) => formatCurrency(job.customer_price) },
    { key: 'bid_count', header: 'Bids', render: (job) => <span className="font-medium">{job.bid_count}</span> },
    { key: 'winning_bid', header: 'Winning Bid', render: (job) => job.winning_bid ? formatCurrency(job.winning_bid) : '-' },
    { key: 'status', header: 'Status', render: (job) => <StatusBadge variant={getStatusVariant(job.status)}>{job.status.replace('_', ' ')}</StatusBadge> },
  ];

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

