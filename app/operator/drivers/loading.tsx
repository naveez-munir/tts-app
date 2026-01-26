import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Drivers Loading State
 * Shows skeleton UI while drivers data is loading
 */
export default function DriversLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-2 h-5 w-48 animate-pulse rounded-lg bg-neutral-100" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-primary-200" />
      </div>

      {/* Driver Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
              <div className="flex-1">
                {/* Name */}
                <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                {/* Phone */}
                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-neutral-100" />
                {/* Email */}
                <div className="mt-1 h-4 w-40 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
            {/* License info */}
            <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-16 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-8 w-16 animate-pulse rounded-lg bg-neutral-100" />
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

