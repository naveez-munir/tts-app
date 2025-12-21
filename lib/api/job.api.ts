/**
 * Job API Service
 * Handles job-related API calls for operators
 */

import { apiClient } from './client';
import type { Job, GetJobResponse, GetJobsResponse } from '@/lib/types';

// ============================================================================
// JOB API ENDPOINTS
// ============================================================================

/**
 * Get job by ID
 * GET /jobs/:id
 */
export const getJobById = async (id: string): Promise<Job> => {
  const response = await apiClient.get<GetJobResponse>(`/jobs/${id}`);
  return response.data.data;
};

/**
 * Get available jobs for operator by postcode
 * GET /jobs/available/:postcode
 */
export const getAvailableJobs = async (postcode: string): Promise<Job[]> => {
  const response = await apiClient.get<GetJobsResponse>(`/jobs/available/${postcode}`);
  return response.data.data;
};

/**
 * Get all available jobs for the current operator
 * Uses the operator's service areas from their profile
 * GET /jobs/available
 */
export const getOperatorAvailableJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<GetJobsResponse>('/jobs/operator/available');
  return response.data.data;
};

/**
 * Get assigned jobs for the current operator
 * GET /jobs/operator/assigned
 */
export const getOperatorAssignedJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<GetJobsResponse>('/jobs/operator/assigned');
  return response.data.data;
};

/**
 * Submit driver details for an assigned job
 * POST /jobs/:id/driver-details
 */
export interface SubmitDriverDetailsDto {
  driverName: string;
  driverPhone: string;
  vehicleRegistration: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
}

export const submitDriverDetails = async (
  jobId: string,
  data: SubmitDriverDetailsDto
): Promise<Job> => {
  const response = await apiClient.post<GetJobResponse>(`/jobs/${jobId}/driver-details`, data);
  return response.data.data;
};

/**
 * Mark job as completed
 * POST /jobs/:id/complete
 */
export const markJobCompleted = async (jobId: string): Promise<Job> => {
  const response = await apiClient.post<GetJobResponse>(`/jobs/${jobId}/complete`);
  return response.data.data;
};

