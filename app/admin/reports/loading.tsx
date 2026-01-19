/**
 * Admin Reports Loading State
 * Skeleton UI while reports page is loading
 */
export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-24 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-8 w-20 animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-16 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-neutral-200" />
            <div className="h-64 w-full animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-4">
          <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="divide-y divide-neutral-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="ml-auto h-5 w-24 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

