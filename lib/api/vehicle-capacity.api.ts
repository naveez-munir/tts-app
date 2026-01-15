/**
 * Vehicle Capacity API Service
 * Handles vehicle capacity-related API calls
 */

import { apiClient } from './client';
import type {
  VehicleCapacity,
  VehicleCapacityListResponse,
  VehicleCapacityResponse,
  UpdateVehicleCapacityDto,
} from '@/lib/types';
import type { VehicleType } from '@/lib/types/enums';

// ============================================================================
// PUBLIC ENDPOINTS
// ============================================================================

/**
 * Get all active vehicle capacities (public) - Client-side
 * GET /api/vehicle-capacities
 */
export const getVehicleCapacities = async (): Promise<VehicleCapacity[]> => {
  const response = await apiClient.get<VehicleCapacityListResponse>('/api/vehicle-capacities');
  return response.data.data.vehicleCapacities;
};

/**
 * Get all active vehicle capacities (public) - Server-side with caching
 * Uses native fetch with Next.js caching (revalidates every hour)
 * GET /api/vehicle-capacities
 */
export const getVehicleCapacitiesServer = async (): Promise<VehicleCapacity[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${baseUrl}/api/vehicle-capacities`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn('Failed to fetch vehicle capacities from API');
      return [];
    }

    const data: VehicleCapacityListResponse = await response.json();
    return data.data.vehicleCapacities;
  } catch (error) {
    console.warn('Failed to fetch vehicle capacities:', error);
    return [];
  }
};

// Vehicle label mapping
const VEHICLE_LABELS: Record<string, string> = {
  SALOON: 'Saloon',
  ESTATE: 'Estate',
  GREEN_CAR: 'Green Car (Electric)',
  MPV: 'People Carrier',
  EXECUTIVE: 'Executive',
  EXECUTIVE_LUXURY: 'Executive Luxury',
  EXECUTIVE_PEOPLE_CARRIER: 'Executive People Carrier',
  MINIBUS: '8-Seater Minibus',
};

// Price multipliers (until backend provides pricing)
const PRICE_MULTIPLIERS: Record<string, number> = {
  SALOON: 1.0,
  ESTATE: 1.05,
  GREEN_CAR: 0.97,
  MPV: 1.65,
  EXECUTIVE: 1.65,
  EXECUTIVE_LUXURY: 2.75,
  EXECUTIVE_PEOPLE_CARRIER: 1.95,
  MINIBUS: 2.1,
};

/**
 * Convert VehicleCapacity array to VehicleTypeData format for UI
 * Returns empty array if capacities is undefined/null/empty
 */
export const convertToVehicleTypeData = (capacities: VehicleCapacity[] | undefined | null) => {
  if (!capacities || capacities.length === 0) {
    return [];
  }

  return capacities
    .filter((c) => c.isActive)
    .map((c) => ({
      value: c.vehicleType,
      label: VEHICLE_LABELS[c.vehicleType] || c.vehicleType,
      passengers: c.maxPassengersHandOnly
        ? `1-${c.maxPassengersHandOnly}`
        : `1-${c.maxPassengers}`,
      luggage: `${c.maxSuitcases} large, ${c.maxHandLuggage} hand`,
      maxPassengers: c.maxPassengers,
      maxLuggage: c.maxSuitcases,
      description: c.description || c.exampleModels,
      priceMultiplier: PRICE_MULTIPLIERS[c.vehicleType] || 1.0,
    }));
};

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Get all vehicle capacities including inactive (admin)
 * GET /admin/vehicle-capacities
 */
export const getAdminVehicleCapacities = async (): Promise<VehicleCapacity[]> => {
  const response = await apiClient.get<VehicleCapacityListResponse>('/admin/vehicle-capacities');
  return response.data.data.vehicleCapacities;
};

/**
 * Update vehicle capacity (admin)
 * PATCH /admin/vehicle-capacities/:vehicleType
 */
export const updateVehicleCapacity = async (
  vehicleType: VehicleType | string,
  data: UpdateVehicleCapacityDto
): Promise<VehicleCapacity> => {
  const response = await apiClient.patch<VehicleCapacityResponse>(
    `/admin/vehicle-capacities/${vehicleType}`,
    data
  );
  return response.data.data;
};

