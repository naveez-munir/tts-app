/**
 * Booking Types
 * Matches backend DTOs from tts-api/src/modules/bookings/dto/
 */

import { z } from 'zod';
import {
  VehicleType,
  ServiceType,
  JourneyType,
  BookingStatus,
  BookingGroupStatus,
  DiscountType,
} from './enums';

// ============================================================================
// ZOD SCHEMAS (for form validation)
// ============================================================================

export const StopSchema = z.object({
  address: z.string().min(1, 'Stop address is required'),
  postcode: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  notes: z.string().optional(),
});

export type StopDto = z.infer<typeof StopSchema>;

const JourneySchema = z.object({
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  pickupPostcode: z.string().optional(),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffAddress: z.string().min(1, 'Dropoff address is required'),
  dropoffPostcode: z.string().optional(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  pickupDatetime: z.string().datetime({ message: 'Invalid datetime format' }),
  passengerCount: z.number().min(1).max(16),
  luggageCount: z.number().min(0),
  vehicleType: z.enum([
    'SALOON',
    'ESTATE',
    'MPV',
    'EXECUTIVE',
    'EXECUTIVE_LUXURY',
    'EXECUTIVE_PEOPLE_CARRIER',
    'GREEN_CAR',
    'MINIBUS',
  ]),
  serviceType: z.enum(['AIRPORT_PICKUP', 'AIRPORT_DROPOFF', 'POINT_TO_POINT']),
  flightNumber: z.string().optional(),
  specialRequirements: z.string().optional(),
  terminal: z.string().optional(),
  hasMeetAndGreet: z.boolean().optional().default(false),
  childSeats: z.number().int().min(0).optional().default(0),
  boosterSeats: z.number().int().min(0).optional().default(0),
  stops: z.array(StopSchema).optional().default([]),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerPrice: z.number().positive('Price must be positive'),
});

// One-way booking schema
export const CreateBookingSchema = JourneySchema.extend({
  isReturnJourney: z.literal(false).optional().default(false),
});

// Return journey booking schema (includes both legs)
export const CreateReturnBookingSchema = z.object({
  isReturnJourney: z.literal(true),
  outbound: JourneySchema,
  returnJourney: JourneySchema,
  totalPrice: z.number().positive('Total price must be positive'),
  discountAmount: z.number().min(0).optional(),
});

// Update booking schema
export const UpdateBookingSchema = z.object({
  pickupDatetime: z.string().datetime().optional(),
  passengerCount: z.number().min(1).max(16).optional(),
  luggageCount: z.number().min(0).optional(),
  specialRequirements: z.string().optional(),
  flightNumber: z.string().optional(),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;
export type CreateReturnBookingDto = z.infer<typeof CreateReturnBookingSchema>;
export type UpdateBookingDto = z.infer<typeof UpdateBookingSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface StopResponse {
  id: string;
  stopOrder: number;
  address: string;
  postcode: string | null;
  lat: number;
  lng: number;
  notes: string | null;
}

export interface Booking {
  id: string;
  customerId: string;
  bookingReference: string;
  journeyType: JourneyType;
  bookingGroupId: string | null;
  linkedBookingId: string | null;
  pickupAddress: string;
  pickupPostcode: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffPostcode: string;
  dropoffLat: number;
  dropoffLng: number;
  pickupDatetime: string;
  passengerCount: number;
  luggageCount: number;
  vehicleType: VehicleType;
  serviceType: ServiceType;
  flightNumber: string | null;
  specialRequirements: string | null;
  distanceMiles: number | null;
  durationMinutes: number | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  terminal: string | null;
  hasMeetAndGreet: boolean;
  childSeats: number;
  boosterSeats: number;
  stops: StopResponse[];
  customerPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingGroup {
  id: string;
  groupReference: string;
  customerId: string;
  totalPrice: number;
  discountType: DiscountType | null;
  discountAmount: number | null;
  status: BookingGroupStatus;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
}

export interface OrganizedBookings {
  oneWayBookings: Booking[];
  returnJourneys: BookingGroup[];
}

export interface CreateBookingResponse {
  success: boolean;
  data: {
    isReturnJourney: false;
    booking: Booking;
  };
}

export interface CreateReturnBookingResponse {
  success: boolean;
  data: {
    isReturnJourney: true;
    bookingGroup: BookingGroup;
  };
}

export interface GetOrganizedBookingsResponse {
  success: boolean;
  data: OrganizedBookings;
  meta: {
    oneWayCount: number;
    returnJourneyCount: number;
    totalBookings: number;
  };
}

