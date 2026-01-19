/**
 * Admin Settings Loading State
 * Skeleton UI while settings page is loading
 */
export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Settings Sections Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((section) => (
          <div key={section} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-neutral-200" />
            <div className="space-y-4">
              {[1, 2, 3].map((field) => (
                <div key={field} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <div className="h-10 w-24 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

