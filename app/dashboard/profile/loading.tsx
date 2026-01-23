export default function ProfileLoading() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div>
        <div className="h-7 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1 h-4 w-48 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Profile Header Card Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-3 w-24 animate-pulse rounded bg-neutral-200" />
              </div>
              <div className="h-5 w-14 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>

          {/* Contact Info Card Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 h-4 w-36 animate-pulse rounded bg-neutral-200" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                  <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 h-2 w-12 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details Card Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                  <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 h-2 w-16 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

