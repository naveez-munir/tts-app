/**
 * Admin Operators Loading State
 * Skeleton UI while operators list is loading
 */
export default function OperatorsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-neutral-200" />
            </div>
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-neutral-200" />
            <div className="mt-1 h-4 w-28 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>

      {/* Operator Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
              <div className="flex-1">
                <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                <div className="mt-2 h-4 w-48 animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-8 w-20 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

