import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function UpcomingTripsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-7 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Summary Card Skeleton */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-neutral-200" />
          <div>
            <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}

