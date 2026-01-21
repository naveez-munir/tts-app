import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-neutral-200 sm:h-10 sm:w-10" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 h-5 w-8 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-4 sm:gap-6 pb-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
          ))}
        </div>
      </div>

      {/* Content Loading */}
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}

