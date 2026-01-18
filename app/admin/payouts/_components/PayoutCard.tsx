'use client';

import { useState } from 'react';
import {
  Building2,
  Mail,
  ChevronDown,
  ChevronUp,
  Banknote,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils/date';
import type { OperatorPayoutSummary } from '@/lib/api/payout.api';

interface PayoutCardProps {
  payout: OperatorPayoutSummary;
  type: 'pending' | 'processing';
  isLoading: boolean;
  onInitiate: () => void;
  onComplete: () => void;
}

export default function PayoutCard({
  payout,
  type,
  isLoading,
  onInitiate,
  onComplete,
}: PayoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasBankDetails = payout.bankAccountNumber && payout.bankSortCode;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary-100 p-2.5">
            <Building2 className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{payout.companyName}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
              <Mail className="h-3.5 w-3.5" />
              {payout.contactEmail}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-neutral-500">{payout.jobCount} jobs</p>
            <p className="text-xl font-bold text-success-600">
              {formatCurrency(payout.totalAmount)}
            </p>
          </div>

          {type === 'pending' ? (
            <Button
              onClick={onInitiate}
              disabled={isLoading || !hasBankDetails}
              size="sm"
              title={!hasBankDetails ? 'Operator has no bank details' : undefined}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Banknote className="mr-2 h-4 w-4" />
              )}
              Initiate
            </Button>
          ) : (
            <Button onClick={onComplete} disabled={isLoading} size="sm" variant="primary">
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Complete
            </Button>
          )}
        </div>
      </div>

      {/* Bank Details */}
      {hasBankDetails && (
        <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-neutral-500">Account Name:</span>{' '}
              <span className="font-medium text-neutral-700">
                {payout.bankAccountName || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500">Sort Code:</span>{' '}
              <span className="font-mono font-medium text-neutral-700">
                {payout.bankSortCode}
              </span>
            </div>
            <div>
              <span className="text-neutral-500">Account No:</span>{' '}
              <span className="font-mono font-medium text-neutral-700">
                {payout.bankAccountNumber}
              </span>
            </div>
          </div>
        </div>
      )}

      {!hasBankDetails && (
        <div className="border-t border-warning-100 bg-warning-50 px-5 py-3">
          <p className="text-sm text-warning-700">
            ⚠️ Missing bank details - operator needs to add bank account information
          </p>
        </div>
      )}

      {/* Expandable Jobs Section */}
      <div className="border-t border-neutral-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm text-neutral-600 hover:bg-neutral-50"
        >
          <span>View {payout.jobCount} job{payout.jobCount !== 1 ? 's' : ''}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-neutral-100 px-5 pb-4">
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500">
                  <th className="pb-2 font-medium">Booking Ref</th>
                  <th className="pb-2 font-medium">Completed</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payout.jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="py-2 font-mono text-neutral-700">{job.bookingReference}</td>
                    <td className="py-2 text-neutral-600">
                      {new Date(job.completedAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 text-right font-medium text-neutral-900">
                      {formatCurrency(job.bidAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

