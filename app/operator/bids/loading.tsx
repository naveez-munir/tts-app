import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Bids Loading State
 * Shows skeleton UI while bids data is loading
 */
export default function BidsLoading() {
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

      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded-full bg-warning-200" />
        <div className="h-6 w-40 animate-pulse rounded-lg bg-neutral-200" />
      </div>

      {/* Bid Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
            </div>

            {/* Addresses */}
            <div className="mb-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-success-200" />
                <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-error-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>

            {/* Date/Time */}
            <div className="mb-3 flex gap-3">
              <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-16 animate-pulse rounded bg-neutral-100" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
              <div>
                <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
                <div className="mt-1 h-6 w-20 animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="h-9 w-28 animate-pulse rounded-lg bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );
}

