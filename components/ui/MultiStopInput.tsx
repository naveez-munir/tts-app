'use client';

import { Plus, X, MapPin, Circle } from 'lucide-react';
import { AddressAutocomplete, AddressValue } from '@/components/ui/AddressAutocomplete';
import { cn } from '@/lib/utils';

export interface StopData {
  id: string;
  text: string;
  address: string;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  placeId: string;
}

interface MultiStopInputProps {
  stops: StopData[];
  onChange: (stops: StopData[]) => void;
  maxStops?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
}

const emptyStop = (): StopData => ({
  id: Math.random().toString(36).substring(2, 15),
  text: '',
  address: '',
  postcode: null,
  lat: null,
  lng: null,
  placeId: '',
});

export function MultiStopInput({
  stops,
  onChange,
  maxStops = 5,
  disabled = false,
  className,
  error,
}: MultiStopInputProps) {
  const canAddStop = stops.length < maxStops;
  const hasReachedLimit = stops.length >= maxStops;

  const handleAddStop = () => {
    if (canAddStop) {
      onChange([...stops, emptyStop()]);
    }
  };

  const handleRemoveStop = (index: number) => {
    onChange(stops.filter((_, i) => i !== index));
  };

  const handleStopTextChange = (index: number, text: string) => {
    const updated = [...stops];
    updated[index] = { ...updated[index], text };
    onChange(updated);
  };

  const handleStopSelect = (index: number, address: AddressValue) => {
    const updated = [...stops];
    updated[index] = {
      ...updated[index],
      text: address.address,
      address: address.address,
      postcode: address.postcode,
      lat: address.lat,
      lng: address.lng,
      placeId: address.placeId,
    };
    onChange(updated);
  };

  if (stops.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <button
          type="button"
          onClick={handleAddStop}
          disabled={disabled}
          className="group flex w-full items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-50"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Circle className="h-2.5 w-2.5 fill-current" />
            </div>
            <div className="h-4 w-0.5 bg-neutral-300 group-hover:bg-primary-300" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 group-hover:bg-primary-100 group-hover:text-primary-600">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <div className="h-4 w-0.5 bg-neutral-300 group-hover:bg-primary-300" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <MapPin className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">
              Add a stop along the way
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Need to make a stop? Add up to 5 locations between pickup and drop-off
            </p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Circle className="h-2 w-2 fill-current" />
            </div>
            <div className="my-1 h-3 w-0.5 bg-neutral-300" />
          </div>
          <div className="flex-1 pb-2">
            <p className="text-xs font-medium text-neutral-500">Pickup</p>
          </div>
        </div>

        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div key={stop.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-xs font-semibold text-accent-700">
                  {index + 1}
                </div>
                <div className="my-1 h-full min-h-[12px] w-0.5 bg-neutral-300" />
              </div>
              <div className="flex flex-1 items-start gap-2 pb-2">
                <div className="flex-1">
                  <AddressAutocomplete
                    value={stop.text}
                    onChange={(text) => handleStopTextChange(index, text)}
                    onSelect={(address) => handleStopSelect(index, address)}
                    placeholder={`Enter stop ${index + 1} address`}
                    disabled={disabled}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  disabled={disabled}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-error-50 hover:text-error-600 disabled:opacity-50"
                  aria-label={`Remove stop ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <MapPin className="h-3 w-3" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-500">Drop-off</p>
          </div>
        </div>

        {canAddStop && (
          <button
            type="button"
            onClick={handleAddStop}
            disabled={disabled}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add another stop
          </button>
        )}

        {hasReachedLimit && (
          <p className="mt-3 text-center text-xs text-amber-600">
            Maximum of {maxStops} stops reached
          </p>
        )}
      </div>

      {error && (
        <p className="rounded bg-error-100 px-2 py-1 text-sm font-medium text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}

