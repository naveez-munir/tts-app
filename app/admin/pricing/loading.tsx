/**
 * Admin Pricing Loading State
 * Skeleton UI while pricing configuration is loading
 */
export default function PricingLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Pricing Cards Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
              <div className="h-8 w-16 animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Pricing Table Skeleton */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-4">
          <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="divide-y divide-neutral-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 animate-pulse rounded bg-neutral-200" />
              <div className="flex-1">
                <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-8 w-16 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

