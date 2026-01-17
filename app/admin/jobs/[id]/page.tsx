'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Gavel, MapPin, User, Car, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InfoCard } from '@/components/ui/InfoCard';
import { CountdownTimer } from '@/components/admin/jobs/CountdownTimer';
import { StopsIndicator } from '@/components/ui/StopsList';
import { closeBiddingEarly, manualJobAssignment, reopenBidding, getJobDetails } from '@/lib/api/admin.api';
import { formatDateTime, formatCurrency, formatTimeRemaining } from '@/lib/utils/date';
import type { StopResponse } from '@/lib/types';

// Normalized interface for display (camelCase)
interface NormalizedBid {
  id: string;
  operatorId: string;
  operatorName: string;
  amount: number;
  submittedAt: string;
  status: string;
}

interface NormalizedCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface NormalizedAssignedOperator {
  id: string;
  companyName: string;
  email: string;
}

interface NormalizedJobDetails {
  id: string;
  bookingReference: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDatetime: string;
  customerPrice: number;
  vehicleType: string;
  biddingStartsAt: string;
  biddingEndsAt: string;
  bidsCount: number;
  lowestBid: number | null;
  platformMargin: number | null;
  createdAt: string;
  customer: NormalizedCustomer | null;
  assignedOperator: NormalizedAssignedOperator | null;
  winningBid: number | null;
  bids: NormalizedBid[];
  stops: StopResponse[];
}

// Helper to normalize bid data from API
function normalizeBid(raw: Record<string, unknown>): NormalizedBid {
  // Handle both camelCase and snake_case, and nested operator object
  const operator = raw.operator as Record<string, unknown> | undefined;
  return {
    id: (raw.id ?? '') as string,
    operatorId: (raw.operatorId ?? raw.operator_id ?? operator?.id ?? '') as string,
    operatorName: (raw.operatorName ?? raw.operator_name ?? operator?.companyName ?? operator?.company_name ?? 'Unknown Operator') as string,
    amount: (raw.bidAmount ?? raw.bid_amount ?? raw.amount ?? 0) as number,
    submittedAt: (raw.submittedAt ?? raw.submitted_at ?? raw.createdAt ?? raw.created_at ?? '') as string,
    status: (raw.status ?? 'PENDING') as string,
  };
}

// Helper to normalize job data from API (handles both snake_case and camelCase)
function normalizeJobDetails(raw: Record<string, unknown>): NormalizedJobDetails {
  // Handle nested booking object if present
  const booking = raw.booking as Record<string, unknown> | undefined;
  const rawBids = (raw.bids ?? []) as Record<string, unknown>[];
  const rawCustomer = (raw.customer ?? booking?.customer) as Record<string, unknown> | undefined;
  const rawAssignedOperator = raw.assignedOperator as Record<string, unknown> | undefined;
  const biddingWindow = raw.biddingWindow as Record<string, unknown> | undefined;

  // Parse customer price (handle string or number)
  const customerPriceRaw = raw.customerPrice ?? raw.customer_price ?? booking?.customerPrice ?? booking?.customer_price ?? 0;
  const customerPrice = typeof customerPriceRaw === 'string' ? parseFloat(customerPriceRaw) : (customerPriceRaw as number);

  // Parse lowestBid (handle string or number)
  const lowestBidRaw = raw.lowestBid ?? raw.lowest_bid ?? null;
  const lowestBid = lowestBidRaw ? (typeof lowestBidRaw === 'string' ? parseFloat(lowestBidRaw) : (lowestBidRaw as number)) : null;

  // Parse platformMargin (handle string or number)
  const platformMarginRaw = raw.platformMargin ?? raw.platform_margin ?? null;
  const platformMargin = platformMarginRaw ? (typeof platformMarginRaw === 'string' ? parseFloat(platformMarginRaw) : (platformMarginRaw as number)) : null;

  // Parse winningBid (handle string or number)
  const winningBidRaw = raw.winningBid ?? raw.winning_bid ?? null;
  const winningBid = winningBidRaw ? (typeof winningBidRaw === 'string' ? parseFloat(winningBidRaw) : (winningBidRaw as number)) : null;

  return {
    id: (raw.id ?? '') as string,
    bookingReference: (
      raw.bookingReference ??
      raw.booking_reference ??
      booking?.bookingReference ??
      booking?.booking_reference ??
      ''
    ) as string,
    status: (raw.status ?? '') as string,
    pickupLocation: (
      raw.pickupLocation ??
      raw.pickup_location ??
      booking?.pickupAddress ??
      booking?.pickup_address ??
      booking?.pickupLocation ??
      booking?.pickup_location ??
      ''
    ) as string,
    dropoffLocation: (
      raw.dropoffLocation ??
      raw.dropoff_location ??
      booking?.dropoffAddress ??
      booking?.dropoff_address ??
      booking?.dropoffLocation ??
      booking?.dropoff_location ??
      ''
    ) as string,
    pickupDatetime: (
      raw.pickupDatetime ??
      raw.pickup_datetime ??
      booking?.pickupDatetime ??
      booking?.pickup_datetime ??
      ''
    ) as string,
    customerPrice,
    vehicleType: (
      raw.vehicleType ??
      raw.vehicle_type ??
      booking?.vehicleType ??
      booking?.vehicle_type ??
      ''
    ) as string,
    biddingStartsAt: (
      biddingWindow?.opensAt ??
      biddingWindow?.opens_at ??
      raw.biddingWindowOpensAt ??
      raw.bidding_window_opens_at ??
      raw.biddingStartsAt ??
      raw.bidding_starts_at ??
      ''
    ) as string,
    biddingEndsAt: (
      biddingWindow?.closesAt ??
      biddingWindow?.closes_at ??
      raw.biddingWindowClosesAt ??
      raw.bidding_window_closes_at ??
      raw.biddingEndsAt ??
      raw.bidding_ends_at ??
      ''
    ) as string,
    bidsCount: (raw.bidsCount ?? raw.bids_count ?? rawBids.length ?? 0) as number,
    lowestBid,
    platformMargin,
    winningBid,
    createdAt: (raw.createdAt ?? raw.created_at ?? '') as string,
    customer: rawCustomer ? {
      email: (rawCustomer.email ?? '') as string,
      firstName: (rawCustomer.firstName ?? rawCustomer.first_name ?? '') as string,
      lastName: (rawCustomer.lastName ?? rawCustomer.last_name ?? '') as string,
      phone: (rawCustomer.phone ?? rawCustomer.phoneNumber ?? rawCustomer.phone_number ?? '') as string,
    } : null,
    assignedOperator: rawAssignedOperator ? {
      id: (rawAssignedOperator.id ?? '') as string,
      companyName: (rawAssignedOperator.companyName ?? rawAssignedOperator.company_name ?? '') as string,
      email: (rawAssignedOperator.email ?? '') as string,
    } : null,
    bids: rawBids.map(normalizeBid),
    stops: ((booking?.stops ?? raw.stops ?? []) as StopResponse[]),
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<NormalizedJobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState<NormalizedBid | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        setIsLoading(true);
        const response = await getJobDetails(jobId);
        const normalizedJob = normalizeJobDetails(response.data as Record<string, unknown>);
        setJob(normalizedJob);
      } catch (error) {
        console.error('Failed to fetch job:', error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  const handleCloseBidding = async () => {
    try {
      setIsProcessing(true);
      await closeBiddingEarly(jobId);

      // Refresh job data to get updated status
      const response = await getJobDetails(jobId);
      const normalizedJob = normalizeJobDetails(response.data as Record<string, unknown>);
      setJob(normalizedJob);

      setShowCloseDialog(false);
      alert('✅ Bidding closed successfully');
    } catch (error: any) {
      console.error('Failed to close bidding:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to close bidding. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReopenBidding = async () => {
    try {
      setIsProcessing(true);
      await reopenBidding(jobId, 24);

      // Refresh job data to get updated status
      const response = await getJobDetails(jobId);
      const normalizedJob = normalizeJobDetails(response.data as Record<string, unknown>);
      setJob(normalizedJob);

      setShowReopenDialog(false);
      alert('✅ Bidding reopened for 24 hours');
    } catch (error: any) {
      console.error('Failed to reopen bidding:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reopen bidding. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignBid = async (bid: NormalizedBid) => {
    try {
      setIsProcessing(true);
      await manualJobAssignment(jobId, { operatorId: bid.operatorId, bidAmount: bid.amount });

      // Refresh job data to get updated status
      const response = await getJobDetails(jobId);
      const normalizedJob = normalizeJobDetails(response.data as Record<string, unknown>);
      setJob(normalizedJob);

      setSelectedBid(null);
      alert(`✅ Job successfully assigned to ${bid.operatorName} for ${formatCurrency(bid.amount)}`);
    } catch (error: any) {
      console.error('Failed to assign bid:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign job. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <LoadingOverlay message="Loading job details..." />;
  if (!job) return <div className="text-center py-12 text-error-600">Job not found</div>;

  const sortedBids = [...(job.bids ?? [])].sort((a, b) => a.amount - b.amount);

  // Use API-provided values instead of client-side calculation
  const lowestBidAmount = job.lowestBid ?? (sortedBids[0]?.amount || null);
  const margin = job.platformMargin ?? (lowestBidAmount ? job.customerPrice - lowestBidAmount : null);

  // Check for valid status for showing bidding controls
  const isOpenForBidding = job.status === 'OPEN_FOR_BIDDING' || job.status === 'OPEN';
  const hasNoBids = job.status === 'NO_BIDS_RECEIVED' || job.status === 'NO_BIDS';
  const isAssigned = job.status === 'ASSIGNED';

  // Calculate time remaining for bidding window
  const timeRemaining = job.biddingEndsAt ? formatTimeRemaining(job.biddingEndsAt) : null;
  const isBiddingActive = timeRemaining && timeRemaining !== 'Ended';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-lg w-fit cursor-pointer transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">Job: {job.bookingReference || job.id.slice(0, 8).toUpperCase()}</h1>
            <StatusBadge variant={getStatusVariant(job.status)}>{job.status.replace(/_/g, ' ')}</StatusBadge>
          </div>
          <p className="text-neutral-600">Pickup: {job.pickupDatetime ? formatDateTime(job.pickupDatetime) : 'Not set'}</p>
        </div>
        <div className="flex gap-2">
          {isOpenForBidding && <Button variant="outline" onClick={() => setShowCloseDialog(true)}>Close Bidding</Button>}
          {hasNoBids && <Button variant="secondary" onClick={() => setShowReopenDialog(true)}>Reopen Bidding</Button>}
        </div>
      </div>

      {/* Top Row: Customer & Journey Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        {job.customer && (
          <InfoCard
            title="Customer Information"
            icon={User}
            items={[
              { label: 'Name', value: `${job.customer.firstName} ${job.customer.lastName}` },
              { label: 'Email', value: job.customer.email },
              ...(job.customer.phone ? [{ label: 'Phone', value: job.customer.phone }] : []),
            ]}
          />
        )}

        {/* Journey Details */}
        <InfoCard
          title="Journey Details"
          icon={MapPin}
          items={[
            {
              label: 'Pickup Time',
              value: (
                <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-semibold">
                  <Calendar className="w-4 h-4" />
                  {job.pickupDatetime ? formatDateTime(job.pickupDatetime) : 'Not set'}
                </span>
              ),
            },
            { label: 'From', value: job.pickupLocation || 'Not specified' },
            ...(job.stops && job.stops.length > 0 ? [{
              label: 'Stops',
              value: <StopsIndicator count={job.stops.length} />,
            }] : []),
            { label: 'To', value: job.dropoffLocation || 'Not specified' },
            { label: 'Vehicle Type', value: job.vehicleType ? job.vehicleType.replace('_', ' ') : 'Not specified' },
            { label: 'Customer Price', value: formatCurrency(job.customerPrice), className: 'text-lg font-semibold' },
          ]}
        />
      </div>

      {/* Middle Row: Bidding Window & Margin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bidding Window */}
        <InfoCard
          title="Bidding Window"
          icon={Clock}
          items={[
            { label: 'Started', value: job.biddingStartsAt ? formatDateTime(job.biddingStartsAt) : 'Not set' },
            { label: 'Ends', value: job.biddingEndsAt ? formatDateTime(job.biddingEndsAt) : 'Not set' },
            { label: 'Total Bids', value: job.bidsCount.toString(), className: 'text-lg font-semibold' },
          ]}
        >
          {job.biddingEndsAt && isBiddingActive && (
            <CountdownTimer endDate={job.biddingEndsAt} />
          )}
        </InfoCard>

        {/* Potential Margin */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Potential Margin</h2>
          {margin !== null && margin > 0 ? (
            <div>
              <p className="text-3xl font-bold text-success-600">{formatCurrency(margin)}</p>
              <p className="text-sm text-neutral-500 mt-2">Based on lowest bid of {formatCurrency(lowestBidAmount!)}</p>
            </div>
          ) : (
            <p className="text-neutral-500">{job.bidsCount === 0 ? 'No bids received yet' : 'Calculating...'}</p>
          )}
        </div>

        {/* Job Metadata */}
        <InfoCard
          title="Job Information"
          icon={Calendar}
          items={[
            { label: 'Created', value: job.createdAt ? formatDateTime(job.createdAt) : 'N/A' },
            { label: 'Status', value: <StatusBadge variant={getStatusVariant(job.status)}>{job.status.replace(/_/g, ' ')}</StatusBadge> },
            ...(isAssigned && job.assignedOperator ? [
              { label: 'Assigned To', value: job.assignedOperator.companyName }
            ] : []),
          ]}
        />
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-neutral-600" />
          Bids ({job.bidsCount})
        </h2>
        {job.bidsCount === 0 ? (
          <div className="text-center py-12">
            <Gavel className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No bids received</p>
            <p className="text-sm text-neutral-400 mt-1">Operators will submit bids during the bidding window</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Operator</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Bid Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Margin</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Submitted</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sortedBids.map((bid, idx) => (
                  <tr key={bid.id} className={idx === 0 ? 'bg-success-50' : 'hover:bg-neutral-50 transition-colors'}>
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      {bid.operatorName}
                      {idx === 0 && <span className="text-xs bg-success-600 text-white px-2 py-0.5 rounded-full ml-2">Lowest</span>}
                    </td>
                    <td className="py-3 px-4 text-neutral-900">{formatCurrency(bid.amount)}</td>
                    <td className="py-3 px-4 text-success-600 font-medium">{formatCurrency(job.customerPrice - bid.amount)}</td>
                    <td className="py-3 px-4 text-neutral-600 text-sm">{bid.submittedAt ? formatDateTime(bid.submittedAt) : 'N/A'}</td>
                    <td className="py-3 px-4 text-right">
                      {isOpenForBidding && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedBid(bid)}
                          className="gap-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Assign
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog isOpen={showCloseDialog} onClose={() => setShowCloseDialog(false)} onConfirm={handleCloseBidding} title="Close Bidding Early" message="This will end the bidding window and select the lowest bid as the winner." confirmText="Close Bidding" variant="warning" isLoading={isProcessing} />
      <ConfirmDialog isOpen={showReopenDialog} onClose={() => setShowReopenDialog(false)} onConfirm={handleReopenBidding} title="Reopen Bidding" message="This will reopen bidding for 24 hours." confirmText="Reopen" variant="info" isLoading={isProcessing} />
      <ConfirmDialog isOpen={!!selectedBid} onClose={() => setSelectedBid(null)} onConfirm={() => selectedBid && handleAssignBid(selectedBid)} title="Manually Assign Job" message={`Assign this job to ${selectedBid?.operatorName} for ${selectedBid ? formatCurrency(selectedBid.amount) : ''}?`} confirmText="Assign" variant="info" isLoading={isProcessing} />
    </div>
  );
}

