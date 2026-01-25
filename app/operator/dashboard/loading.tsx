import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Dashboard Loading State
 * Shows skeleton UI while dashboard data is loading
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-2 h-5 w-48 animate-pulse rounded-lg bg-neutral-100" />
        </div>
        <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-200" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="mt-2 h-8 w-16 animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="h-10 w-10 animate-pulse rounded-lg bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 animate-pulse rounded-lg bg-neutral-100" />
              <div>
                <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-4 w-24 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );
}

