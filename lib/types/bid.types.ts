/**
 * Bid Types
 * Matches backend DTOs from tts-api/src/modules/bids/dto/
 */

import { z } from 'zod';
import { BidStatus } from './enums';

// ============================================================================
// ZOD SCHEMAS (for form validation)
// ============================================================================

export const CreateBidSchema = z.object({
  jobId: z.string().refine((val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val), {
    message: 'Invalid job ID',
  }),
  bidAmount: z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
    message: 'Invalid bid amount format',
  }),
  notes: z.string().optional(),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type CreateBidDto = z.infer<typeof CreateBidSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface Bid {
  id: string;
  jobId: string;
  operatorId: string;
  bidAmount: number;
  status: BidStatus;
  notes: string | null;
  submittedAt: string;
  updatedAt: string;
  // Acceptance tracking fields
  offeredAt?: string | null;
  respondedAt?: string | null;
}

export interface CreateBidResponse {
  success: boolean;
  data: Bid;
  message: string;
}

export interface GetBidsResponse {
  success: boolean;
  data: Bid[];
  meta: {
    total: number;
  };
}

