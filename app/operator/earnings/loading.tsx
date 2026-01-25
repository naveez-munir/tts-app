import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Earnings Loading State
 * Shows skeleton UI while earnings data is loading
 */
export default function EarningsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-2 h-5 w-48 animate-pulse rounded-lg bg-neutral-100" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-200" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="mt-2 h-8 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-neutral-100" />
              </div>
              <div className="h-10 w-10 animate-pulse rounded-lg bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Payout Info */}
      <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 animate-pulse rounded bg-accent-200" />
          <div className="flex-1">
            <div className="h-5 w-32 animate-pulse rounded bg-accent-200" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-accent-100" />
            <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-accent-100" />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-neutral-200" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );
}

