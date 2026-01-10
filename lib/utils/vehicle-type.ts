/**
 * Vehicle Type Display Utilities
 * Provides consistent vehicle type labels and info across the app
 *
 * Source of Truth: /lib/data/quote.data.ts - VEHICLE_TYPES array
 *
 * All 8 vehicle types with proper labels:
 * - SALOON → "Saloon" (1-4 passengers, 3 large bags)
 * - ESTATE → "Estate" (1-4 passengers, 4 large bags)
 * - GREEN_CAR → "Green Car (Electric)" (1-4 passengers, 2 large bags)
 * - MPV → "People Carrier" (5-6 passengers, 5 large bags)
 * - EXECUTIVE → "Executive" (1-4 passengers, 3 large bags)
 * - EXECUTIVE_LUXURY → "Executive Luxury" (1-3 passengers, 2 large bags)
 * - EXECUTIVE_PEOPLE_CARRIER → "Executive People Carrier" (5-6 passengers, 5 large bags)
 * - MINIBUS → "8-Seater Minibus" (1-8 passengers, 8 large bags)
 */

import { VEHICLE_TYPES } from '@/lib/data/quote.data';

/**
 * Get display label for a vehicle type
 * @example getVehicleTypeLabel('MPV') => 'People Carrier'
 */
export const getVehicleTypeLabel = (vehicleType: string): string => {
  const vehicle = VEHICLE_TYPES.find((v) => v.value === vehicleType);
  return vehicle?.label || vehicleType;
};

/**
 * Get vehicle type with passenger/luggage info
 * @example getVehicleTypeWithInfo('MPV') => 'People Carrier (5-6 passengers, 5 large bags)'
 */
export const getVehicleTypeWithInfo = (vehicleType: string): string => {
  const vehicle = VEHICLE_TYPES.find((v) => v.value === vehicleType);
  if (!vehicle) return vehicleType;
  return `${vehicle.label} (${vehicle.passengers} passengers, ${vehicle.luggage})`;
};

/**
 * Get vehicle type description
 * @example getVehicleTypeDescription('MPV') => 'VW Sharan, Ford Galaxy or similar...'
 */
export const getVehicleTypeDescription = (vehicleType: string): string => {
  const vehicle = VEHICLE_TYPES.find((v) => v.value === vehicleType);
  return vehicle?.description || '';
};

/**
 * Get all vehicle type options for select dropdown
 */
export const getVehicleTypeOptions = () => {
  return VEHICLE_TYPES.map((v) => ({
    value: v.value,
    label: v.label,
    info: `${v.passengers} passengers, ${v.luggage}`,
  }));
};
