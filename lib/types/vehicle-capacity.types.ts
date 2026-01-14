/**
 * Vehicle Capacity Types
 * Matches backend DTOs from tts-api/src/modules/vehicle-capacity/dto/
 */

import { z } from 'zod';
import { VehicleType } from './enums';

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface VehicleCapacity {
  id: string;
  vehicleType: VehicleType;
  maxPassengers: number;
  maxPassengersHandOnly: number | null;
  maxSuitcases: number;
  maxHandLuggage: number;
  exampleModels: string;
  description: string | null;
  isActive: boolean;
}

export interface VehicleCapacityListResponse {
  success: boolean;
  data: {
    vehicleCapacities: VehicleCapacity[];
  };
}

export interface VehicleCapacityResponse {
  success: boolean;
  data: VehicleCapacity;
}

// ============================================================================
// UPDATE DTO
// ============================================================================

export const UpdateVehicleCapacitySchema = z.object({
  maxPassengers: z.number().int().min(1).max(20).optional(),
  maxPassengersHandOnly: z.number().int().min(1).max(20).nullable().optional(),
  maxSuitcases: z.number().int().min(0).max(20).optional(),
  maxHandLuggage: z.number().int().min(0).max(20).optional(),
  exampleModels: z.string().min(1).max(500).optional(),
  description: z.string().max(1000).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateVehicleCapacityDto = z.infer<typeof UpdateVehicleCapacitySchema>;

