/**
 * Payment Types
 * Matches backend DTOs from tts-api/src/modules/payments/dto/
 */

import { z } from 'zod';
import { TransactionType, TransactionStatus } from './enums';

// ============================================================================
// ZOD SCHEMAS (for form validation)
// ============================================================================

export const CreatePaymentIntentSchema = z.object({
  bookingId: z.string().refine((val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val), {
    message: 'Invalid booking ID',
  }),
  amount: z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
    message: 'Invalid amount format',
  }),
});

export const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID required'),
  bookingId: z.string().refine((val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val), {
    message: 'Invalid booking ID',
  }),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type CreatePaymentIntentDto = z.infer<typeof CreatePaymentIntentSchema>;
export type ConfirmPaymentDto = z.infer<typeof ConfirmPaymentSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface Transaction {
  id: string;
  bookingId: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  stripeTransactionId: string | null;
  stripePaymentIntentId: string | null;
  status: TransactionStatus;
  description: string | null;
  metadata: Record<string, any> | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  data: {
    paymentIntent: PaymentIntent;
    transaction: Transaction;
  };
}

export interface ConfirmPaymentResponse {
  success: boolean;
  data: {
    transaction: Transaction;
    booking: any; // Booking type
  };
  message: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  data: Transaction[];
  meta: {
    total: number;
  };
}

