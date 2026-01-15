/**
 * Operator API Service
 * Handles operator-related API calls
 */

import axios from 'axios';
import { apiClient } from './client';
import type {
  RegisterOperatorDto,
  UpdateBankDetailsDto,
  UpdateOperatorProfileDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  Vehicle,
  VehiclePhoto,
  OperatorProfile,
  OperatorDashboard,
  RegisterOperatorResponse,
  GetOperatorProfileResponse,
  GetOperatorDashboardResponse,
  StopResponse,
  CreateDriverDto,
  UpdateDriverDto,
  Driver,
  GetDriversResponse,
  GetDriverResponse,
  CreateDriverResponse,
  UpdateDriverResponse,
  DeleteDriverResponse,
} from '@/lib/types';

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export type DocumentType = 'license' | 'insurance' | 'other';
export type FileType = 'pdf' | 'jpg' | 'jpeg' | 'png';

export interface OperatorDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl?: string; // Presigned download URL (returned from GET /operators/documents)
  uploadedAt: string;
  expiresAt: string | null;
  urlExpiresIn?: number; // Seconds until the presigned URL expires
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  expiresIn: number;
}

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
 * PATCH /operators/profile
 */
export const updateOperatorProfile = async (
  data: UpdateOperatorProfileDto
): Promise<OperatorProfile> => {
  const response = await apiClient.patch<GetOperatorProfileResponse>(
    `/operators/profile`,
    data
  );
  return response.data.data;
};

/**
 * Update bank details
 * PATCH /operators/bank-details
 */
export const updateBankDetails = async (
  data: UpdateBankDetailsDto
): Promise<OperatorProfile> => {
  const response = await apiClient.patch<GetOperatorProfileResponse>(
    `/operators/bank-details`,
    data
  );
  return response.data.data;
};

// ============================================================================
// JOB OFFER ENDPOINTS (Accept/Decline)
// ============================================================================

export interface JobOffer {
  id: string;
  bookingId: string;
  bookingReference: string;
  status: string;
  bidId: string;
  bidAmount: number;
  acceptanceWindowOpensAt: string;
  acceptanceWindowClosesAt: string;
  acceptanceAttemptCount: number;
  booking: {
    id: string;
    bookingReference: string;
    pickupAddress: string;
    pickupPostcode: string | null;
    dropoffAddress: string;
    dropoffPostcode: string | null;
    pickupDatetime: string;
    passengerCount: number;
    luggageCount: number;
    vehicleType: string;
    serviceType: string;
    flightNumber: string | null;
    specialRequirements: string | null;
    customerPrice: number;
    terminal: string | null;
    hasMeetAndGreet: boolean;
    stops: StopResponse[];
    childSeats: number;
    boosterSeats: number;
    distanceMiles: number | null;
    durationMinutes: number | null;
  };
}

export interface JobOfferResponse {
  success: boolean;
  data: JobOffer[];
  meta: {
    total: number;
  };
}

export interface AcceptDeclineResponse {
  success: boolean;
  data: {
    job: {
      id: string;
      status: string;
    };
    bid: {
      id: string;
      status: string;
    };
  };
  message: string;
}

/**
 * Get pending job offers for the current operator
 * GET /operators/job-offers
 */
export const getJobOffers = async (): Promise<JobOffer[]> => {
  const response = await apiClient.get<JobOfferResponse>('/operators/job-offers');
  return response.data.data;
};

/**
 * Accept a job offer
 * POST /operators/jobs/:bookingReference/accept
 */
export const acceptJobOffer = async (bookingReference: string): Promise<AcceptDeclineResponse['data']> => {
  const response = await apiClient.post<AcceptDeclineResponse>(
    `/operators/jobs/${bookingReference}/accept`
  );
  return response.data.data;
};

/**
 * Decline a job offer
 * POST /operators/jobs/:bookingReference/decline
 */
export const declineJobOffer = async (bookingReference: string): Promise<AcceptDeclineResponse['data']> => {
  const response = await apiClient.post<AcceptDeclineResponse>(
    `/operators/jobs/${bookingReference}/decline`
  );
  return response.data.data;
};

// ============================================================================
// DOCUMENT UPLOAD ENDPOINTS
// ============================================================================

/**
 * Get presigned URL for document upload
 * POST /uploads/presigned-url
 */
export const getDocumentUploadUrl = async (
  fileName: string,
  fileType: FileType,
  documentType: DocumentType
): Promise<UploadUrlResponse> => {
  try {
    const payload = { fileName, fileType, documentType };

    const response = await apiClient.post<{ success: boolean; data: UploadUrlResponse }>(
      '/uploads/presigned-url',
      payload
    );
    return response.data.data;
  } catch (error: any) {

    // Extract validation error details from backend
    const validationDetails = error.response?.data?.error?.details;
    if (validationDetails) {
      console.error('❌ Validation error details:', validationDetails);
    }
    throw error;
  }
};

/**
 * Upload file directly to S3 using presigned URL
 */
export const uploadFileToS3 = async (
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

/**
 * Confirm document upload and create database record
 * POST /uploads/confirm
 */
export const confirmDocumentUpload = async (
  key: string,
  documentType: DocumentType,
  originalFileName: string,
  expiresAt?: string
): Promise<OperatorDocument> => {
  const response = await apiClient.post<{ success: boolean; data: OperatorDocument }>(
    '/uploads/confirm',
    { key, documentType, originalFileName, expiresAt }
  );
  return response.data.data;
};

/**
 * Get list of operator documents
 * GET /operators/documents
 */
export const getOperatorDocuments = async (): Promise<OperatorDocument[]> => {
  const response = await apiClient.get<{ success: boolean; data: OperatorDocument[] }>(
    '/operators/documents'
  );
  return response.data.data;
};

/**
 * Get download URL for a document
 * GET /uploads/:documentId/download-url
 */
export const getDocumentDownloadUrl = async (documentId: string): Promise<string> => {
  const response = await apiClient.get<{ success: boolean; data: DownloadUrlResponse }>(
    `/uploads/${documentId}/download-url`
  );
  return response.data.data.downloadUrl;
};

/**
 * Delete a document
 * DELETE /operators/documents/:documentId
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  await apiClient.delete(`/operators/documents/${documentId}`);
};

/**
 * Helper: Get file extension from filename
 */
export const getFileType = (fileName: string): FileType | null => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf' || ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
    return ext as FileType;
  }
  return null;
};

/**
 * Helper: Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Please upload PDF, JPG, or PNG.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit.' };
  }

  return { valid: true };
};

// ============================================================================
// VEHICLE MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * Get all vehicles for the operator
 * GET /operators/vehicles
 */
export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get<{ success: boolean; data: Vehicle[] }>(
    '/operators/vehicles'
  );
  return response.data.data;
};

/**
 * Get a single vehicle by ID
 * GET /operators/vehicles/:vehicleId
 */
export const getVehicle = async (vehicleId: string): Promise<Vehicle> => {
  const response = await apiClient.get<{ success: boolean; data: Vehicle }>(
    `/operators/vehicles/${vehicleId}`
  );
  return response.data.data;
};

/**
 * Create a new vehicle
 * POST /operators/vehicles
 */
export const createVehicle = async (data: CreateVehicleDto): Promise<Vehicle> => {
  const response = await apiClient.post<{ success: boolean; data: Vehicle; message: string }>(
    '/operators/vehicles',
    data
  );
  return response.data.data;
};

/**
 * Update a vehicle
 * PATCH /operators/vehicles/:vehicleId
 */
export const updateVehicle = async (
  vehicleId: string,
  data: UpdateVehicleDto
): Promise<Vehicle> => {
  const response = await apiClient.patch<{ success: boolean; data: Vehicle; message: string }>(
    `/operators/vehicles/${vehicleId}`,
    data
  );
  return response.data.data;
};

/**
 * Delete a vehicle
 * DELETE /operators/vehicles/:vehicleId
 */
export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await apiClient.delete(`/operators/vehicles/${vehicleId}`);
};

// ============================================================================
// VEHICLE PHOTOS ENDPOINTS
// ============================================================================

/**
 * Get all photos for a vehicle
 * GET /operators/vehicles/:vehicleId/photos
 */
export const getVehiclePhotos = async (vehicleId: string): Promise<VehiclePhoto[]> => {
  const response = await apiClient.get<{ success: boolean; data: VehiclePhoto[] }>(
    `/operators/vehicles/${vehicleId}/photos`
  );
  return response.data.data;
};

/**
 * Update vehicle photos (upsert)
 * PUT /operators/vehicles/:vehicleId/photos
 */
export const updateVehiclePhotos = async (
  vehicleId: string,
  photos: Array<{ photoType: string; photoUrl: string }>
): Promise<VehiclePhoto[]> => {
  const response = await apiClient.put<{ success: boolean; data: VehiclePhoto[] }>(
    `/operators/vehicles/${vehicleId}/photos`,
    { photos }
  );
  return response.data.data;
};

// ============================================================================
// DRIVER MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * Get all drivers for the operator
 * GET /operators/drivers
 */
export const getDrivers = async (): Promise<Driver[]> => {
  const response = await apiClient.get<GetDriversResponse>('/operators/drivers');
  return response.data.data;
};

/**
 * Get a single driver by ID
 * GET /operators/drivers/:driverId
 */
export const getDriver = async (driverId: string): Promise<Driver> => {
  const response = await apiClient.get<GetDriverResponse>(
    `/operators/drivers/${driverId}`
  );
  return response.data.data;
};

/**
 * Create a new driver
 * POST /operators/drivers
 */
export const createDriver = async (data: CreateDriverDto): Promise<Driver> => {
  const response = await apiClient.post<CreateDriverResponse>(
    '/operators/drivers',
    data
  );
  return response.data.data;
};

/**
 * Update a driver
 * PATCH /operators/drivers/:driverId
 */
export const updateDriver = async (
  driverId: string,
  data: UpdateDriverDto
): Promise<Driver> => {
  const response = await apiClient.patch<UpdateDriverResponse>(
    `/operators/drivers/${driverId}`,
    data
  );
  return response.data.data;
};

/**
 * Delete a driver
 * DELETE /operators/drivers/:driverId
 */
export const deleteDriver = async (
  driverId: string
): Promise<DeleteDriverResponse['data']> => {
  const response = await apiClient.delete<DeleteDriverResponse>(
    `/operators/drivers/${driverId}`
  );
  return response.data.data;
};
