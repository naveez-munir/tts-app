/**
 * Payout API Service
 * All payout-related API calls
 */

import { apiClient } from './client';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

export interface PayoutSettings {
  enabled: boolean;
  initialDelayDays: number;
  frequency: string;
  jobsHeldBack: number;
  payoutDay: number;
  adminEmail: string;
}

export interface PayoutJob {
  id: string;
  bookingReference: string;
  bidAmount: number;
  completedAt: string;
}

export interface OperatorPayoutSummary {
  operatorId: string;
  companyName: string;
  contactEmail: string;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankSortCode: string | null;
  totalAmount: number;
  jobCount: number;
  jobs: PayoutJob[];
}

export interface PayoutListResponse {
  success: boolean;
  data: OperatorPayoutSummary[];
  meta: {
    count: number;
    totalAmount: number;
  };
}

export interface SkippedOperator {
  operatorId: string;
  companyName: string;
  reason: string;
}

export interface CalculatePayoutsResponse {
  success: boolean;
  data: {
    operatorPayouts: OperatorPayoutSummary[];
    skippedOperators: SkippedOperator[];
  };
  meta: {
    operatorCount: number;
    skippedCount: number;
    totalAmount: number;
  };
}

export interface CompletePayoutData {
  operatorId: string;
  jobIds: string[];
  bankReference?: string;
}

export interface OperatorEarnings {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  processingPayouts: number;
}

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Get payout settings (admin only)
 */
export const getPayoutSettings = async (): Promise<PayoutSettings> => {
  const response: AxiosResponse = await apiClient.get('/payouts/settings');
  return response.data;
};

/**
 * Get pending payouts - operators eligible for payout (admin only)
 */
export const getPendingPayouts = async (): Promise<PayoutListResponse> => {
  const response: AxiosResponse = await apiClient.get('/payouts/pending');
  return response.data;
};

/**
 * Get processing payouts - awaiting bank transfer (admin only)
 */
export const getProcessingPayouts = async (): Promise<PayoutListResponse> => {
  const response: AxiosResponse = await apiClient.get('/payouts/processing');
  return response.data;
};

/**
 * Calculate payout summaries (admin only)
 */
export const calculatePayouts = async (): Promise<CalculatePayoutsResponse> => {
  const response: AxiosResponse = await apiClient.post('/payouts/calculate');
  return response.data;
};

/**
 * Initiate payouts - mark jobs as processing (admin only)
 */
export const initiatePayouts = async (operatorId: string, jobIds: string[]): Promise<void> => {
  await apiClient.post('/payouts/initiate', { operatorId, jobIds });
};

/**
 * Complete payout after bank transfer (admin only)
 */
export const completePayout = async (data: CompletePayoutData): Promise<{ transactionId: string; totalAmount: number }> => {
  const response: AxiosResponse = await apiClient.post('/payouts/complete', data);
  return response.data.data;
};

// ============================================================================
// OPERATOR ENDPOINTS
// ============================================================================

/**
 * Get operator's own earnings (operator only)
 */
export const getMyEarnings = async (): Promise<OperatorEarnings> => {
  const response: AxiosResponse = await apiClient.get('/payouts/my-earnings');
  return response.data.data;
};

