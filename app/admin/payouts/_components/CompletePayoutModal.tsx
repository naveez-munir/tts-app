'use client';

import { useState } from 'react';
import { CheckCircle, Building2, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils/date';
import type { OperatorPayoutSummary } from '@/lib/api/payout.api';

interface CompletePayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: OperatorPayoutSummary | null;
  onComplete: (bankReference: string) => Promise<void>;
  isLoading: boolean;
}

export default function CompletePayoutModal({
  isOpen,
  onClose,
  payout,
  onComplete,
  isLoading,
}: CompletePayoutModalProps) {
  const [bankReference, setBankReference] = useState('');

  if (!isOpen || !payout) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onComplete(bankReference);
    setBankReference('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-success-100 p-2">
            <CheckCircle className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Complete Payout</h2>
            <p className="text-sm text-neutral-500">Confirm bank transfer details</p>
          </div>
        </div>

        {/* Payout Summary */}
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="h-4 w-4 text-neutral-400" />
            <span className="font-medium text-neutral-900">{payout.companyName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-neutral-500">Jobs</p>
              <p className="font-medium text-neutral-700">{payout.jobCount}</p>
            </div>
            <div>
              <p className="text-neutral-500">Total Amount</p>
              <p className="font-semibold text-success-600">
                {formatCurrency(payout.totalAmount)}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1">Transfer to:</p>
            <div className="flex gap-4 text-sm">
              <span className="font-mono text-neutral-700">{payout.bankSortCode}</span>
              <span className="font-mono text-neutral-700">{payout.bankAccountNumber}</span>
            </div>
            {payout.bankAccountName && (
              <p className="mt-1 text-sm text-neutral-600">{payout.bankAccountName}</p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              label="Bank Reference (Optional)"
              placeholder="e.g., TTS-PAY-20240111"
              value={bankReference}
              onChange={(e) => setBankReference(e.target.value)}
            />
            <p className="mt-1 text-xs text-neutral-500">
              Enter the bank transfer reference for your records
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Banknote className="mr-2 h-4 w-4" />
                  Confirm Payout
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info Note */}
        <p className="mt-4 text-center text-xs text-neutral-500">
          This will mark the payout as complete and notify the operator.
        </p>
      </div>
    </div>
  );
}

