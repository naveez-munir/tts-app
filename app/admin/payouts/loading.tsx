/**
 * Admin Payouts Loading State
 * Skeleton UI while payouts list is loading
 */
export default function PayoutsLoading() {
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
            <div className="mt-4 h-8 w-24 animate-pulse rounded bg-neutral-200" />
            <div className="mt-1 h-4 w-20 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>

      {/* Payout Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
                <div>
                  <div className="h-5 w-40 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-2 h-4 w-32 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="mt-2 h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

