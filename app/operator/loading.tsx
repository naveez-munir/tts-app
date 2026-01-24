import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Operator Route Loading State
 * Shows a loading spinner while operator pages are loading
 * Follows Next.js 15 loading UI patterns
 */
export default function OperatorLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-neutral-500">Loading...</p>
    </div>
  );
}

