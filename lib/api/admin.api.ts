/**
 * Admin API Service
 * All admin-related API calls
 */

import { apiClient } from './client';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

// Backend response structure from admin.service.ts getDashboard()
export interface DashboardStats {
  kpis: {
    totalBookings: number;
    totalRevenue: number;
    platformCommission: number;
    activeOperators: number;
    pendingOperatorApprovals: number;
    suspendedOperators: number;
    activeJobs: number;
    jobsWithNoBids: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: 'INFO' | 'WARNING' | 'ERROR';
  }>;
}

export interface ListOperatorsQuery {
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  page?: number;
  limit?: number;
  search?: string;
}

export interface OperatorApprovalData {
  approvalStatus: 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  notes?: string;
}

export interface ListBookingsQuery {
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface RefundBookingData {
  amount: number;
  reason: string;
}

export interface ManualJobAssignmentData {
  operatorId: string;
  bidAmount: number;
}

export interface ReportsQuery {
  startDate: string;
  endDate: string;
}

export interface PricingRuleData {
  ruleType: string;
  vehicleType?: string;
  value: number;
  description?: string;
  isActive?: boolean;
}

// Helper to transform pricing rule data to match backend DTO
// Backend uses camelCase with "baseValue" instead of "value"
const transformPricingRuleToApi = (data: Partial<PricingRuleData>) => {
  const apiData: Record<string, unknown> = {};

  if (data.ruleType !== undefined) apiData.ruleType = data.ruleType;
  if (data.vehicleType !== undefined) apiData.vehicleType = data.vehicleType || undefined;
  if (data.value !== undefined) apiData.baseValue = data.value;
  if (data.description !== undefined) apiData.description = data.description;
  if (data.isActive !== undefined) apiData.isActive = data.isActive;

  return apiData;
};

// ============================================================================
// DASHBOARD
// ============================================================================

export const getDashboard = async (): Promise<DashboardStats> => {
  const response: AxiosResponse = await apiClient.get('/admin/dashboard');
  return response.data.data;
};

// ============================================================================
// OPERATORS
// ============================================================================

export const listOperators = async (query: ListOperatorsQuery = {}) => {
  const response: AxiosResponse = await apiClient.get('/admin/operators', { params: query });
  return response.data;
};

export const updateOperatorApproval = async (id: string, data: OperatorApprovalData) => {
  const response: AxiosResponse = await apiClient.patch(`/admin/operators/${id}/approval`, data);
  return response.data;
};

// ============================================================================
// BOOKINGS
// ============================================================================

export const listBookings = async (query: ListBookingsQuery = {}) => {
  const response: AxiosResponse = await apiClient.get('/admin/bookings', { params: query });
  return response.data;
};

export const refundBooking = async (id: string, data: RefundBookingData) => {
  const response: AxiosResponse = await apiClient.post(`/admin/bookings/${id}/refund`, data);
  return response.data;
};

export const listBookingGroups = async (query: ListBookingsQuery = {}) => {
  const response: AxiosResponse = await apiClient.get('/admin/booking-groups', { params: query });
  return response.data;
};

export const getBookingGroup = async (id: string) => {
  const response: AxiosResponse = await apiClient.get(`/admin/booking-groups/${id}`);
  return response.data;
};

// ============================================================================
// JOBS
// ============================================================================

export const listJobs = async (query: ListBookingsQuery = {}) => {
  const response: AxiosResponse = await apiClient.get('/admin/jobs', { params: query });
  return response.data;
};

export const getEscalatedJobs = async () => {
  const response: AxiosResponse = await apiClient.get('/admin/jobs/escalated');
  return response.data;
};

export const getJobDetails = async (jobId: string) => {
  const response: AxiosResponse = await apiClient.get(`/admin/jobs/${jobId}`);
  return response.data;
};

export const manualJobAssignment = async (jobId: string, data: ManualJobAssignmentData) => {
  const response: AxiosResponse = await apiClient.post(`/admin/jobs/${jobId}/assign`, data);
  return response.data;
};

export const closeBiddingEarly = async (jobId: string) => {
  const response: AxiosResponse = await apiClient.post(`/admin/jobs/${jobId}/close-bidding`);
  return response.data;
};

export const reopenBidding = async (jobId: string, hours: number = 24) => {
  const response: AxiosResponse = await apiClient.post(`/admin/jobs/${jobId}/reopen-bidding?hours=${hours}`);
  return response.data;
};

// ============================================================================
// PRICING RULES
// ============================================================================

export const listPricingRules = async () => {
  const response: AxiosResponse = await apiClient.get('/admin/pricing-rules');
  return response.data;
};

export const createPricingRule = async (data: PricingRuleData) => {
  const apiData = transformPricingRuleToApi(data);
  console.log('Creating pricing rule with data:', apiData);
  const response: AxiosResponse = await apiClient.post('/admin/pricing-rules', apiData);
  return response.data;
};

export const updatePricingRule = async (id: string, data: Partial<PricingRuleData>) => {
  const apiData = transformPricingRuleToApi(data);
  const response: AxiosResponse = await apiClient.patch(`/admin/pricing-rules/${id}`, apiData);
  return response.data;
};

export const deletePricingRule = async (id: string) => {
  const response: AxiosResponse = await apiClient.delete(`/admin/pricing-rules/${id}`);
  return response.data;
};

// ============================================================================
// BOOKING ACTIONS (uses non-admin routes for update/cancel)
// ============================================================================

export interface UpdateBookingData {
  pickupDatetime?: string;
  passengerCount?: number;
  luggageCount?: number;
  specialRequirements?: string;
}

export const getBookingDetails = async (id: string) => {
  const response: AxiosResponse = await apiClient.get(`/bookings/${id}`);
  return response.data;
};

export const updateBooking = async (id: string, data: UpdateBookingData) => {
  const response: AxiosResponse = await apiClient.patch(`/bookings/${id}`, data);
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response: AxiosResponse = await apiClient.post(`/bookings/${id}/cancel`);
  return response.data;
};

// ============================================================================
// OPERATOR DETAILS
// ============================================================================

export const getOperatorDetails = async (id: string) => {
  // Use list with specific ID filter or fetch from operators list
  const response: AxiosResponse = await apiClient.get('/admin/operators', { params: { search: id } });
  return response.data;
};

// ============================================================================
// REPORTS
// ============================================================================

export const getRevenueReport = async (query: ReportsQuery) => {
  const response: AxiosResponse = await apiClient.get('/admin/reports/revenue', { params: query });
  return response.data;
};

export const getPayoutsReport = async (query: ReportsQuery) => {
  const response: AxiosResponse = await apiClient.get('/admin/reports/payouts', { params: query });
  return response.data;
};
