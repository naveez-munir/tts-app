/**
 * Bid API Service
 * Handles bidding-related API calls for operators
 */

import { apiClient } from './client';
import type { Bid, CreateBidDto, CreateBidResponse, GetBidsResponse } from '@/lib/types';

// ============================================================================
// BID API ENDPOINTS
// ============================================================================

/**
 * Submit a bid on a job
 * POST /bids
 */
export const submitBid = async (data: CreateBidDto): Promise<Bid> => {
  const response = await apiClient.post<CreateBidResponse>('/bids', data);
  return response.data.data;
};

/**
 * Get all bids for a specific job
 * GET /bids/job/:jobId
 */
export const getJobBids = async (jobId: string): Promise<Bid[]> => {
  const response = await apiClient.get<GetBidsResponse>(`/bids/job/${jobId}`);
  return response.data.data;
};

/**
 * Get bid by ID
 * GET /bids/:id
 */
export const getBidById = async (id: string): Promise<Bid> => {
  const response = await apiClient.get<{ success: boolean; data: Bid }>(`/bids/${id}`);
  return response.data.data;
};

/**
 * Get all bids submitted by the current operator
 * GET /bids/operator/my-bids
 */
export const getOperatorBids = async (): Promise<Bid[]> => {
  const response = await apiClient.get<GetBidsResponse>('/bids/operator/my-bids');
  return response.data.data;
};

/**
 * Withdraw a bid
 * POST /bids/:id/withdraw
 */
export const withdrawBid = async (bidId: string): Promise<Bid> => {
  const response = await apiClient.post<{ success: boolean; data: Bid }>(`/bids/${bidId}/withdraw`);
  return response.data.data;
};

