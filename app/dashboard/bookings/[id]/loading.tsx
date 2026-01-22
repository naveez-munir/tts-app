import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function BookingDetailsLoading() {
  return (
    <div className="space-y-4">
      {/* Back Button Skeleton */}
      <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Header Card Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-neutral-200" />
                <div>
                  <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-1 h-6 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-1 h-4 w-20 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>

          {/* Journey Details Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3 w-12 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-1 h-4 w-full animate-pulse rounded bg-neutral-200" />
                    <div className="mt-1 h-3 w-16 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <div className="flex flex-col items-center">
              <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
              <div className="mt-1 h-9 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

