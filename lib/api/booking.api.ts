/**
 * Booking API Service
 * Handles booking-related API calls
 */

import { apiClient } from './client';
import type {
  CreateBookingDto,
  CreateReturnBookingDto,
  UpdateBookingDto,
  Booking,
  BookingGroup,
  OrganizedBookings,
  CreateBookingResponse,
  CreateReturnBookingResponse,
  GetOrganizedBookingsResponse,
} from '@/lib/types';

// ============================================================================
// BOOKING API ENDPOINTS
// ============================================================================

/**
 * Create a one-way booking
 * POST /bookings
 */
export const createBooking = async (data: CreateBookingDto): Promise<Booking> => {
  const response = await apiClient.post<CreateBookingResponse>('/bookings', data);
  return response.data.data.booking;
};

/**
 * Create a return journey (outbound + return with discount)
 * POST /bookings/return
 */
export const createReturnBooking = async (
  data: CreateReturnBookingDto
): Promise<BookingGroup> => {
  const response = await apiClient.post<CreateReturnBookingResponse>('/bookings/return', data);
  return response.data.data.bookingGroup;
};

/**
 * Get customer bookings organized by one-way and return journeys
 * GET /bookings/organized
 */
export const getOrganizedBookings = async (): Promise<{
  data: OrganizedBookings;
  meta: { oneWayCount: number; returnJourneyCount: number; totalBookings: number };
}> => {
  const response = await apiClient.get<GetOrganizedBookingsResponse>('/bookings/organized');
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
};

/**
 * Get all customer bookings (flat list)
 * GET /bookings
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<{ success: boolean; data: Booking[]; meta: any }>(
    '/bookings'
  );
  return response.data.data;
};

/**
 * Get a single booking by ID
 * GET /bookings/:id
 */
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await apiClient.get<{ success: boolean; data: Booking }>(`/bookings/${id}`);
  return response.data.data;
};

/**
 * Get a single booking by reference
 * GET /bookings/reference/:bookingReference
 */
export const getBookingByReference = async (bookingReference: string): Promise<Booking> => {
  const response = await apiClient.get<{ success: boolean; data: Booking }>(
    `/bookings/reference/${bookingReference}`
  );
  return response.data.data;
};

/**
 * Get a booking group by ID
 * GET /bookings/groups/:groupId
 */
export const getBookingGroupById = async (groupId: string): Promise<BookingGroup> => {
  const response = await apiClient.get<{ success: boolean; data: BookingGroup }>(
    `/bookings/groups/${groupId}`
  );
  return response.data.data;
};

/**
 * Get a booking group by reference
 * GET /bookings/groups/reference/:groupReference
 */
export const getBookingGroupByReference = async (
  groupReference: string
): Promise<BookingGroup> => {
  const response = await apiClient.get<{ success: boolean; data: BookingGroup }>(
    `/bookings/groups/reference/${groupReference}`
  );
  return response.data.data;
};

/**
 * Update a booking
 * PATCH /bookings/:id
 */
export const updateBooking = async (id: string, data: UpdateBookingDto): Promise<Booking> => {
  const response = await apiClient.patch<{ success: boolean; data: Booking }>(
    `/bookings/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Cancel a booking
 * POST /bookings/:id/cancel
 */
export const cancelBooking = async (id: string): Promise<Booking> => {
  const response = await apiClient.post<{ success: boolean; data: Booking; message: string }>(
    `/bookings/${id}/cancel`
  );
  return response.data.data;
};

