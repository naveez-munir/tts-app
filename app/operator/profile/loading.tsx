import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Profile Loading State
 * Shows skeleton UI while profile data is loading
 */
export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-2 h-5 w-56 animate-pulse rounded-lg bg-neutral-100" />
        </div>
        <div className="h-8 w-28 animate-pulse rounded-full bg-neutral-200" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <div className="mx-auto h-8 w-12 animate-pulse rounded bg-neutral-200" />
            <div className="mx-auto mt-2 h-4 w-20 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>

      {/* Company Information Section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-primary-200" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-neutral-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
              <div className="flex-1">
                <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
                <div className="mt-1 h-5 w-32 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Areas & Vehicles */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-accent-200" />
            <div className="h-6 w-32 animate-pulse rounded-lg bg-neutral-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-16 animate-pulse rounded-full bg-accent-100" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-primary-200" />
            <div className="h-6 w-32 animate-pulse rounded-lg bg-neutral-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-primary-100" />
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );
}

