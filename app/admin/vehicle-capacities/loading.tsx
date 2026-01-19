/**
 * Admin Vehicle Capacities Loading State
 * Skeleton UI while vehicle capacities page is loading
 */
export default function VehicleCapacitiesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Vehicle Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-neutral-200" />
                <div>
                  <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-1 h-4 w-24 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
              <div className="h-8 w-8 animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-5 w-8 animate-pulse rounded bg-neutral-200" />
              </div>
              <div>
                <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-5 w-8 animate-pulse rounded bg-neutral-200" />
              </div>
              <div>
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-5 w-8 animate-pulse rounded bg-neutral-200" />
              </div>
              <div>
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-5 w-8 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

