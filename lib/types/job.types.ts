/**
 * Job Types
 * Matches backend models from tts-api/prisma/schema.prisma
 */

import { JobStatus } from './enums';
import { Booking } from './booking.types';
import { Bid } from './bid.types';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface DriverDetails {
  id: string;
  jobId: string;
  driverName: string;
  driverPhone: string;
  vehicleRegistration: string;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleColor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  bookingId: string;
  status: JobStatus;
  biddingWindowOpensAt: string;
  biddingWindowClosesAt: string;
  biddingWindowDurationHours: number;
  assignedOperatorId: string | null;
  winningBidId: string | null;
  platformMargin: number | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
  bids?: Bid[];
  driverDetails?: DriverDetails;
}

export interface GetJobResponse {
  success: boolean;
  data: Job;
}

export interface GetJobsResponse {
  success: boolean;
  data: Job[];
  meta: {
    total: number;
  };
}

