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
// OPERATOR DOCUMENTS
// ============================================================================

export interface OperatorDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl?: string;
  uploadedAt: string;
  expiresAt: string | null;
  urlExpiresIn?: number;
}

/**
 * Get operator documents (with presigned URLs)
 * GET /admin/operators/:id/documents
 */
export const getOperatorDocuments = async (operatorId: string): Promise<OperatorDocument[]> => {
  const response: AxiosResponse = await apiClient.get(`/admin/operators/${operatorId}/documents`);
  return response.data.data;
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

// ============================================================================
// SYSTEM SETTINGS
// ============================================================================

export interface SystemSetting {
  id: string;
  key: string;
  value: string | number | boolean;
  rawValue: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'TIME';
  description: string | null;
}

export interface SystemSettingsGrouped {
  [category: string]: SystemSetting[];
}

export interface UpdateSettingData {
  value: string | number | boolean | Record<string, unknown>;
}

export interface BulkUpdateSettingItem {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
}

/**
 * Get all system settings grouped by category
 */
export const getSystemSettings = async (): Promise<SystemSettingsGrouped> => {
  const response: AxiosResponse = await apiClient.get('/admin/system-settings');
  return response.data.data;
};

/**
 * Get system settings by category
 */
export const getSystemSettingsByCategory = async (category: string): Promise<SystemSetting[]> => {
  const response: AxiosResponse = await apiClient.get(`/admin/system-settings/category/${category}`);
  return response.data.data;
};

/**
 * Update a single system setting
 */
export const updateSystemSetting = async (key: string, data: UpdateSettingData): Promise<void> => {
  await apiClient.patch(`/admin/system-settings/${key}`, data);
};

/**
 * Bulk update multiple system settings
 */
export const bulkUpdateSystemSettings = async (updates: BulkUpdateSettingItem[]): Promise<void> => {
  await apiClient.patch('/admin/system-settings', { updates });
};

// ============================================================================
// CUSTOMER MANAGEMENT
// ============================================================================

export interface ListCustomersQuery {
  search?: string;
  isActive?: 'true' | 'false';
  sortBy?: 'createdAt' | 'lastName' | 'email';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  totalBookings: number;
  totalSpent: number;
  registeredAt: string;
}

export interface CustomerDetails {
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  statistics: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    activeBookings: number;
    totalSpent: number;
  };
  recentBookings: Array<{
    id: string;
    bookingReference: string;
    status: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupDatetime: string;
    customerPrice: number;
    vehicleType: string;
    journeyType: string;
    createdAt: string;
  }>;
}

export interface UpdateCustomerStatusData {
  isActive: boolean;
}

export interface CustomerTransactionsQuery {
  transactionType?: 'CUSTOMER_PAYMENT' | 'REFUND' | 'PLATFORM_COMMISSION' | 'OPERATOR_PAYOUT';
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * List all customers with search, filters, and pagination
 */
export const listCustomers = async (query: ListCustomersQuery = {}) => {
  const response: AxiosResponse = await apiClient.get('/admin/customers', { params: query });
  return response.data;
};

/**
 * Get individual customer details with booking statistics
 */
export const getCustomerDetails = async (id: string): Promise<CustomerDetails> => {
  const response: AxiosResponse = await apiClient.get(`/admin/customers/${id}`);
  return response.data.data;
};

/**
 * Update customer account status (activate/deactivate)
 */
export const updateCustomerStatus = async (id: string, data: UpdateCustomerStatusData) => {
  const response: AxiosResponse = await apiClient.patch(`/admin/customers/${id}/status`, data);
  return response.data;
};

/**
 * Get customer booking history with filters
 */
export const getCustomerBookings = async (id: string, query: ListBookingsQuery = {}) => {
  const response: AxiosResponse = await apiClient.get(`/admin/customers/${id}/bookings`, { params: query });
  return response.data;
};

/**
 * Get customer transaction history
 */
export const getCustomerTransactions = async (id: string, query: CustomerTransactionsQuery = {}) => {
  const response: AxiosResponse = await apiClient.get(`/admin/customers/${id}/transactions`, { params: query });
  return response.data;
};
