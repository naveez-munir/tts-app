'use client';

import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StopResponse } from '@/lib/types/booking.types';
import type { StopPoint } from '@/lib/types/quote.types';

type Stop = StopResponse | StopPoint | { address: string; notes?: string | null };

interface StopsListProps {
  pickupAddress: string;
  dropoffAddress: string;
  stops: Stop[];
  className?: string;
  compact?: boolean;
}

export function StopsList({
  pickupAddress,
  dropoffAddress,
  stops,
  className,
  compact = false,
}: StopsListProps) {
  const sortedStops = [...stops].sort((a, b) => {
    const orderA = 'stopOrder' in a ? a.stopOrder : 0;
    const orderB = 'stopOrder' in b ? b.stopOrder : 0;
    return orderA - orderB;
  });

  if (compact) {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 flex-shrink-0 text-success-500" />
          <p className="truncate text-sm text-neutral-700">{pickupAddress}</p>
        </div>
        {sortedStops.length > 0 && (
          <div className="ml-1.5 border-l-2 border-dashed border-neutral-300 py-1 pl-3">
            <span className="text-xs font-medium text-accent-600">
              +{sortedStops.length} stop{sortedStops.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 flex-shrink-0 text-error-500" />
          <p className="truncate text-sm text-neutral-700">{dropoffAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-4', className)}>
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-success-500" />
        {sortedStops.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="h-6 w-0.5 bg-neutral-200" />
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-xs font-medium text-accent-700">
              {index + 1}
            </div>
          </div>
        ))}
        <div className="h-6 w-0.5 bg-neutral-200" />
        <div className="h-3 w-3 rounded-full bg-error-500" />
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <p className="text-sm text-neutral-500">Pickup</p>
          <p className="font-medium text-neutral-800">{pickupAddress}</p>
        </div>

        {sortedStops.map((stop, index) => (
          <div key={'stopOrder' in stop ? stop.id : index}>
            <p className="text-sm text-accent-600">Stop {index + 1}</p>
            <p className="font-medium text-neutral-800">{stop.address}</p>
            {'notes' in stop && stop.notes && (
              <p className="mt-0.5 text-sm text-neutral-500">{stop.notes}</p>
            )}
          </div>
        ))}

        <div>
          <p className="text-sm text-neutral-500">Drop-off</p>
          <p className="font-medium text-neutral-800">{dropoffAddress}</p>
        </div>
      </div>
    </div>
  );
}

interface StopsIndicatorProps {
  count: number;
  className?: string;
}

export function StopsIndicator({ count, className }: StopsIndicatorProps) {
  if (count === 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700',
        className
      )}
    >
      +{count} stop{count > 1 ? 's' : ''}
    </span>
  );
}

