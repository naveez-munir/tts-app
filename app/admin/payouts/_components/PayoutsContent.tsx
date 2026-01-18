'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Banknote,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  getPendingPayouts,
  getProcessingPayouts,
  initiatePayouts,
  completePayout,
  type OperatorPayoutSummary,
} from '@/lib/api/payout.api';
import { formatCurrency } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';
import PayoutCard from './PayoutCard';
import CompletePayoutModal from './CompletePayoutModal';

type TabType = 'pending' | 'processing';

export default function PayoutsContent() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingPayouts, setPendingPayouts] = useState<OperatorPayoutSummary[]>([]);
  const [processingPayouts, setProcessingPayouts] = useState<OperatorPayoutSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal state
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<OperatorPayoutSummary | null>(null);

  const fetchPayouts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pendingRes, processingRes] = await Promise.all([
        getPendingPayouts(),
        getProcessingPayouts(),
      ]);
      setPendingPayouts(pendingRes.data || []);
      setProcessingPayouts(processingRes.data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch payouts:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const handleInitiatePayout = async (payout: OperatorPayoutSummary) => {
    setActionLoading(payout.operatorId);
    setError(null);
    try {
      const jobIds = payout.jobs.map((j) => j.id);
      await initiatePayouts(payout.operatorId, jobIds);
      await fetchPayouts();
    } catch (err: unknown) {
      console.error('Failed to initiate payout:', err);
      const errorMessage = getContextualErrorMessage(err, 'submit');
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenCompleteModal = (payout: OperatorPayoutSummary) => {
    setSelectedPayout(payout);
    setCompleteModalOpen(true);
  };

  const handleCompletePayout = async (bankReference: string) => {
    if (!selectedPayout) return;

    setActionLoading(selectedPayout.operatorId);
    setError(null);
    try {
      const jobIds = selectedPayout.jobs.map((j) => j.id);
      await completePayout({
        operatorId: selectedPayout.operatorId,
        jobIds,
        bankReference: bankReference || undefined,
      });
      setCompleteModalOpen(false);
      setSelectedPayout(null);
      await fetchPayouts();
    } catch (err: unknown) {
      console.error('Failed to complete payout:', err);
      const errorMessage = getContextualErrorMessage(err, 'submit');
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingTotal = pendingPayouts.reduce((sum, p) => sum + p.totalAmount, 0);
  const processingTotal = processingPayouts.reduce((sum, p) => sum + p.totalAmount, 0);

  const currentPayouts = activeTab === 'pending' ? pendingPayouts : processingPayouts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Payouts</h1>
          <p className="mt-1 text-neutral-600">
            Manage operator payouts and bank transfers
          </p>
        </div>
        <Button onClick={fetchPayouts} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-warning-200 bg-warning-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning-700">Pending Payouts</p>
              <p className="mt-1 text-2xl font-bold text-warning-800">
                {formatCurrency(pendingTotal)}
              </p>
              <p className="mt-1 text-sm text-warning-600">
                {pendingPayouts.length} operator{pendingPayouts.length !== 1 ? 's' : ''} ready
              </p>
            </div>
            <div className="rounded-lg bg-warning-100 p-3">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-200 bg-accent-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-700">Processing</p>
              <p className="mt-1 text-2xl font-bold text-accent-800">
                {formatCurrency(processingTotal)}
              </p>
              <p className="mt-1 text-sm text-accent-600">
                {processingPayouts.length} awaiting transfer
              </p>
            </div>
            <div className="rounded-lg bg-accent-100 p-3">
              <Banknote className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex gap-6">
          <TabButton
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            count={pendingPayouts.length}
          >
            Pending
          </TabButton>
          <TabButton
            active={activeTab === 'processing'}
            onClick={() => setActiveTab('processing')}
            count={processingPayouts.length}
          >
            Processing
          </TabButton>
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-error-200 bg-error-50 p-4">
          <AlertCircle className="h-5 w-5 text-error-600" />
          <p className="text-sm text-error-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-error-600 hover:text-error-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : currentPayouts.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-12">
          <EmptyState
            icon={activeTab === 'pending' ? Clock : Banknote}
            title={activeTab === 'pending' ? 'No pending payouts' : 'No processing payouts'}
            description={
              activeTab === 'pending'
                ? 'When operators have completed jobs eligible for payout, they will appear here.'
                : 'Payouts you initiate will appear here until you mark them as complete.'
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {currentPayouts.map((payout) => (
            <PayoutCard
              key={payout.operatorId}
              payout={payout}
              type={activeTab}
              isLoading={actionLoading === payout.operatorId}
              onInitiate={() => handleInitiatePayout(payout)}
              onComplete={() => handleOpenCompleteModal(payout)}
            />
          ))}
        </div>
      )}

      {/* Complete Payout Modal */}
      <CompletePayoutModal
        isOpen={completeModalOpen}
        onClose={() => {
          setCompleteModalOpen(false);
          setSelectedPayout(null);
        }}
        payout={selectedPayout}
        onComplete={handleCompletePayout}
        isLoading={actionLoading !== null}
      />
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}

function TabButton({ active, onClick, count, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
        active
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
      }`}
    >
      {children}
      {count > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            active ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
