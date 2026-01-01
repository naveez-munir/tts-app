/**
 * Operator API Service
 * Handles operator-related API calls
 */

import { apiClient } from './client';
import type {
  RegisterOperatorDto,
  UpdateBankDetailsDto,
  OperatorProfile,
  OperatorDashboard,
  RegisterOperatorResponse,
  GetOperatorProfileResponse,
  GetOperatorDashboardResponse,
} from '@/lib/types';

// ============================================================================
// OPERATOR API ENDPOINTS
// ============================================================================

/**
 * Register as an operator
 * POST /operators/register
 */
export const registerOperator = async (data: RegisterOperatorDto): Promise<OperatorProfile> => {
  const response = await apiClient.post<RegisterOperatorResponse>('/operators/register', data);
  return response.data.data;
};

/**
 * Get operator profile by ID
 * GET /operators/profile/:id
 */
export const getOperatorProfile = async (id: string): Promise<OperatorProfile> => {
  const response = await apiClient.get<GetOperatorProfileResponse>(`/operators/profile/${id}`);
  return response.data.data;
};

/**
 * Get operator dashboard data
 * GET /operators/dashboard
 */
export const getOperatorDashboard = async (): Promise<OperatorDashboard> => {
  const response = await apiClient.get<GetOperatorDashboardResponse>('/operators/dashboard');
  return response.data.data;
};

/**
 * Update operator profile
 * PATCH /operators/profile/:id
 */
export const updateOperatorProfile = async (
  id: string,
  data: Partial<RegisterOperatorDto>
): Promise<OperatorProfile> => {
  const response = await apiClient.patch<GetOperatorProfileResponse>(
    `/operators/profile/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Update bank details
 * PATCH /operators/profile/:id (with bank details)
 */
export const updateBankDetails = async (
  id: string,
  data: UpdateBankDetailsDto
): Promise<OperatorProfile> => {
  const response = await apiClient.patch<GetOperatorProfileResponse>(
    `/operators/profile/${id}`,
    data
  );
  return response.data.data;
};

