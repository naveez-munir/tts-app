/**
 * Payment API Service
 * Handles payment-related API calls
 */

import { apiClient } from './client';
import type {
  CreatePaymentIntentDto,
  ConfirmPaymentDto,
  Transaction,
} from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

export interface PaymentIntentResponse {
  success: boolean;
  data: {
    paymentIntentId: string;
    clientSecret: string;
    bookingId: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export interface ConfirmPaymentResponse {
  success: boolean;
  data: Transaction;
  message: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  data: Transaction[];
  meta: {
    total: number;
  };
}

export interface RefundResponse {
  success: boolean;
  data: Transaction;
  message: string;
}

// For booking groups (return journeys)
export interface CreateGroupPaymentIntentDto {
  bookingGroupId: string;
  amount: string;
}

export interface ConfirmGroupPaymentDto {
  bookingGroupId: string;
  paymentIntentId: string;
}

export interface GroupPaymentIntentResponse {
  success: boolean;
  data: {
    paymentIntentId: string;
    clientSecret: string;
    bookingGroupId: string;
    amount: number;
    currency: string;
    status: string;
  };
}

// ============================================================================
// PAYMENT API ENDPOINTS
// ============================================================================

/**
 * Create a payment intent for a single booking
 * POST /payments/intent
 */
export const createPaymentIntent = async (
  data: CreatePaymentIntentDto
): Promise<PaymentIntentResponse['data']> => {
  const response = await apiClient.post<PaymentIntentResponse>('/payments/intent', data);
  return response.data.data;
};

/**
 * Create a payment intent for a booking group (return journey)
 * POST /payments/group/create-intent
 */
export const createGroupPaymentIntent = async (
  data: CreateGroupPaymentIntentDto
): Promise<GroupPaymentIntentResponse['data']> => {
  const response = await apiClient.post<GroupPaymentIntentResponse>('/payments/group/create-intent', data);
  return response.data.data;
};

/**
 * Confirm payment for a single booking
 * POST /payments/confirm
 */
export const confirmPayment = async (
  data: ConfirmPaymentDto
): Promise<Transaction> => {
  const response = await apiClient.post<ConfirmPaymentResponse>('/payments/confirm', data);
  return response.data.data;
};

/**
 * Confirm payment for a booking group (return journey)
 * POST /payments/group/confirm
 */
export const confirmGroupPayment = async (
  data: ConfirmGroupPaymentDto
): Promise<{ transactions: Transaction[]; bookingGroupId: string }> => {
  const response = await apiClient.post<{
    success: boolean;
    data: { transactions: Transaction[]; bookingGroupId: string };
  }>('/payments/group/confirm', data);
  return response.data.data;
};

/**
 * Get transaction history for a booking
 * GET /payments/history/:bookingId
 */
export const getTransactionHistory = async (
  bookingId: string
): Promise<Transaction[]> => {
  const response = await apiClient.get<TransactionHistoryResponse>(
    `/payments/history/${bookingId}`
  );
  return response.data.data;
};

/**
 * Process a refund for a booking
 * POST /payments/refund/:bookingId
 */
export const refundPayment = async (
  bookingId: string,
  reason: string
): Promise<Transaction> => {
  const response = await apiClient.post<RefundResponse>(
    `/payments/refund/${bookingId}`,
    { reason }
  );
  return response.data.data;
};

