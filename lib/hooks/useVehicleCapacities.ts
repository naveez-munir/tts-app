'use client';

import { useState, useEffect, useCallback } from 'react';
import { getVehicleCapacities } from '@/lib/api/vehicle-capacity.api';
import type { VehicleCapacity } from '@/lib/types';
import { VEHICLE_TYPES } from '@/lib/data/quote.data';
import type { VehicleType as VehicleTypeData } from '@/types/landing.types';

/**
 * Hook to fetch and use vehicle capacities from the API
 * Falls back to hardcoded data if API fails
 */
export function useVehicleCapacities() {
  const [capacities, setCapacities] = useState<VehicleCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCapacities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getVehicleCapacities();
      setCapacities(data);
    } catch (err) {
      console.warn('Failed to fetch vehicle capacities from API, using fallback:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
      setCapacities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapacities();
  }, [fetchCapacities]);

  // Convert API capacities to the format used by vehicle selectors
  const vehicleTypeOptions = capacities.length > 0
    ? capacities
        .filter((c) => c.isActive)
        .map((c) => ({
          value: c.vehicleType,
          label: formatVehicleLabel(c.vehicleType),
          passengers: c.maxPassengersHandOnly
            ? `${c.maxPassengers}-${c.maxPassengersHandOnly}`
            : `1-${c.maxPassengers}`,
          luggage: `${c.maxSuitcases} large, ${c.maxHandLuggage} hand`,
          description: c.description || c.exampleModels,
          priceMultiplier: 1.0, // Placeholder - pricing is handled by backend
        } as VehicleTypeData))
    : VEHICLE_TYPES; // Fallback to hardcoded data

  // Simple dropdown options
  const selectOptions = vehicleTypeOptions.map((v) => ({
    value: v.value,
    label: `${v.label} (${v.passengers} passengers)`,
  }));

  return {
    capacities,
    vehicleTypeOptions,
    selectOptions,
    isLoading,
    error,
    refetch: fetchCapacities,
  };
}

/**
 * Format vehicle type enum to display label
 */
export function formatVehicleLabel(vehicleType: string): string {
  const labels: Record<string, string> = {
    SALOON: 'Saloon',
    ESTATE: 'Estate',
    GREEN_CAR: 'Green Car (Electric)',
    MPV: 'MPV / People Carrier',
    EXECUTIVE: 'Executive',
    EXECUTIVE_LUXURY: 'Executive Luxury',
    EXECUTIVE_PEOPLE_CARRIER: 'Executive People Carrier',
    MINIBUS: 'Minibus',
  };
  return labels[vehicleType] || vehicleType.replace(/_/g, ' ');
}

/**
 * Get vehicle label for display (standalone utility)
 */
export function getVehicleLabel(type: string): string {
  return formatVehicleLabel(type);
}

