'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, Gavel, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { closeBiddingEarly, manualJobAssignment, reopenBidding } from '@/lib/api/admin.api';
import { formatDateTime, formatCurrency } from '@/lib/utils/date';

interface Bid {
  id: string;
  operator_name: string;
  amount: number;
  submitted_at: string;
  status: string;
}

interface JobDetails {
  id: string;
  booking_reference: string;
  status: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  customer_price: number;
  bidding_starts_at: string;
  bidding_ends_at: string;
  bids: Bid[];
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Mock data
    setJob({
      id: jobId,
      booking_reference: 'TTS-ABC123',
      status: 'OPEN',
      pickup_location: 'Heathrow Airport Terminal 5',
      dropoff_location: '10 Downing Street, London',
      pickup_datetime: '2025-01-25T14:30:00Z',
      customer_price: 85.00,
      bidding_starts_at: '2025-01-23T14:30:00Z',
      bidding_ends_at: '2025-01-24T14:30:00Z',
      bids: [
        { id: 'b1', operator_name: 'London Express Cars', amount: 62.00, submitted_at: '2025-01-23T15:00:00Z', status: 'PENDING' },
        { id: 'b2', operator_name: 'Heathrow Transfers Ltd', amount: 58.00, submitted_at: '2025-01-23T16:30:00Z', status: 'PENDING' },
        { id: 'b3', operator_name: 'City Airport Cabs', amount: 65.00, submitted_at: '2025-01-23T17:15:00Z', status: 'PENDING' },
      ],
    });
    setIsLoading(false);
  }, [jobId]);

  const handleCloseBidding = async () => {
    try {
      setIsProcessing(true);
      await closeBiddingEarly(jobId);
      setJob((prev) => prev ? { ...prev, status: 'BIDDING_CLOSED' } : null);
      setShowCloseDialog(false);
    } catch (error) {
      console.error('Failed to close bidding:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReopenBidding = async () => {
    try {
      setIsProcessing(true);
      await reopenBidding(jobId, 24);
      setJob((prev) => prev ? { ...prev, status: 'OPEN' } : null);
      setShowReopenDialog(false);
    } catch (error) {
      console.error('Failed to reopen bidding:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignBid = async (bid: Bid) => {
    try {
      setIsProcessing(true);
      await manualJobAssignment(jobId, { operatorId: bid.id, bidAmount: bid.amount });
      setJob((prev) => prev ? { ...prev, status: 'ASSIGNED' } : null);
      setSelectedBid(null);
    } catch (error) {
      console.error('Failed to assign bid:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <LoadingOverlay message="Loading job details..." />;
  if (!job) return <div className="text-center py-12 text-error-600">Job not found</div>;

  const sortedBids = [...(job.bids ?? [])].sort((a, b) => a.amount - b.amount);
  const lowestBid = sortedBids[0];
  const margin = lowestBid ? job.customer_price - lowestBid.amount : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-lg w-fit"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">Job: {job.booking_reference}</h1>
            <StatusBadge variant={getStatusVariant(job.status)}>{job.status.replace('_', ' ')}</StatusBadge>
          </div>
          <p className="text-neutral-600">Pickup: {formatDateTime(job.pickup_datetime)}</p>
        </div>
        <div className="flex gap-2">
          {job.status === 'OPEN' && <Button variant="outline" onClick={() => setShowCloseDialog(true)}>Close Bidding</Button>}
          {job.status === 'NO_BIDS' && <Button variant="secondary" onClick={() => setShowReopenDialog(true)}>Reopen Bidding</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Journey</h2>
          <div className="space-y-3">
            <div><p className="text-sm text-neutral-500">From</p><p className="font-medium">{job.pickup_location}</p></div>
            <div><p className="text-sm text-neutral-500">To</p><p className="font-medium">{job.dropoff_location}</p></div>
            <div><p className="text-sm text-neutral-500">Customer Price</p><p className="font-semibold text-lg">{formatCurrency(job.customer_price)}</p></div>
          </div>
        </div>

        {/* Bidding Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Bidding Window</h2>
          <div className="space-y-3">
            <div><p className="text-sm text-neutral-500">Started</p><p className="font-medium">{formatDateTime(job.bidding_starts_at)}</p></div>
            <div><p className="text-sm text-neutral-500">Ends</p><p className="font-medium">{formatDateTime(job.bidding_ends_at)}</p></div>
            <div><p className="text-sm text-neutral-500">Total Bids</p><p className="font-semibold text-lg">{job.bids.length}</p></div>
          </div>
        </div>

        {/* Margin */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Potential Margin</h2>
          {margin !== null ? (
            <div><p className="text-3xl font-bold text-success-600">{formatCurrency(margin)}</p><p className="text-sm text-neutral-500">Based on lowest bid of {formatCurrency(lowestBid.amount)}</p></div>
          ) : (
            <p className="text-neutral-500">No bids received yet</p>
          )}
        </div>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Gavel className="w-5 h-5" /> Bids ({job.bids.length})</h2>
        {job.bids.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No bids received</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b"><th className="text-left py-2 text-sm text-neutral-600">Operator</th><th className="text-left py-2 text-sm text-neutral-600">Bid Amount</th><th className="text-left py-2 text-sm text-neutral-600">Margin</th><th className="text-left py-2 text-sm text-neutral-600">Submitted</th><th className="text-right py-2 text-sm text-neutral-600">Action</th></tr></thead>
              <tbody>
                {sortedBids.map((bid, idx) => (
                  <tr key={bid.id} className={idx === 0 ? 'bg-success-50' : ''}>
                    <td className="py-3 font-medium">{bid.operator_name} {idx === 0 && <span className="text-xs bg-success-600 text-white px-2 py-0.5 rounded-full ml-2">Lowest</span>}</td>
                    <td className="py-3">{formatCurrency(bid.amount)}</td>
                    <td className="py-3 text-success-600">{formatCurrency(job.customer_price - bid.amount)}</td>
                    <td className="py-3 text-neutral-600">{formatDateTime(bid.submitted_at)}</td>
                    <td className="py-3 text-right">{job.status === 'OPEN' && <Button size="sm" variant="ghost" onClick={() => setSelectedBid(bid)}>Assign</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog isOpen={showCloseDialog} onClose={() => setShowCloseDialog(false)} onConfirm={handleCloseBidding} title="Close Bidding Early" message="This will end the bidding window and select the lowest bid as the winner." confirmText="Close Bidding" variant="warning" isLoading={isProcessing} />
      <ConfirmDialog isOpen={showReopenDialog} onClose={() => setShowReopenDialog(false)} onConfirm={handleReopenBidding} title="Reopen Bidding" message="This will reopen bidding for 24 hours." confirmText="Reopen" variant="info" isLoading={isProcessing} />
      <ConfirmDialog isOpen={!!selectedBid} onClose={() => setSelectedBid(null)} onConfirm={() => selectedBid && handleAssignBid(selectedBid)} title="Manually Assign Job" message={`Assign this job to ${selectedBid?.operator_name} for ${selectedBid ? formatCurrency(selectedBid.amount) : ''}?`} confirmText="Assign" variant="info" isLoading={isProcessing} />
    </div>
  );
}

