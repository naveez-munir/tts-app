import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Assigned Jobs Loading State
 * Shows skeleton UI while assigned jobs data is loading
 */
export default function AssignedLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-40 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-2 h-5 w-56 animate-pulse rounded-lg bg-neutral-100" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-200" />
      </div>

      {/* Section Title */}
      <div className="h-6 w-48 animate-pulse rounded-lg bg-neutral-200" />

      {/* Job Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
              </div>
            </div>

            {/* Addresses */}
            <div className="mb-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-success-200" />
                <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-error-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>

            {/* Date/Time/Passengers */}
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-16 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
            </div>

            {/* Driver Details Section */}
            <div className="border-t border-neutral-100 pt-4">
              <div className="h-10 w-full animate-pulse rounded-lg bg-primary-200" />
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

