/**
 * Operator Types
 * Matches backend DTOs from tts-api/src/modules/operators/dto/
 */

import { z } from 'zod';
import { VehicleType, OperatorApprovalStatus, DocumentType } from './enums';

// ============================================================================
// ZOD SCHEMAS (for form validation)
// ============================================================================

export const RegisterOperatorSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  vatNumber: z.string().optional(),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area required'),
  vehicleTypes: z.array(z.enum(['SALOON', 'ESTATE', 'MPV', 'EXECUTIVE', 'MINIBUS'])),
});

export const UpdateBankDetailsSchema = z.object({
  bankAccountName: z.string().min(1, 'Account name is required'),
  bankAccountNumber: z.string().refine((val) => /^\d{8}$/.test(val), {
    message: 'Must be 8 digits',
  }),
  bankSortCode: z.string().refine((val) => /^\d{6}$/.test(val), {
    message: 'Must be 6 digits',
  }),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type RegisterOperatorDto = z.infer<typeof RegisterOperatorSchema>;
export type UpdateBankDetailsDto = z.infer<typeof UpdateBankDetailsSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface Vehicle {
  id: string;
  operatorId: string;
  vehicleType: VehicleType;
  registrationPlate: string;
  make: string;
  model: string;
  year: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceArea {
  id: string;
  operatorId: string;
  postcode: string;
  createdAt: string;
}

export interface Document {
  id: string;
  operatorId: string;
  documentType: DocumentType;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  expiresAt: string | null;
}

export interface OperatorProfile {
  id: string;
  userId: string;
  companyName: string;
  registrationNumber: string;
  vatNumber: string | null;
  approvalStatus: OperatorApprovalStatus;
  reputationScore: number;
  totalJobs: number;
  completedJobs: number;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankSortCode: string | null;
  createdAt: string;
  updatedAt: string;
  vehicles?: Vehicle[];
  documents?: Document[];
  serviceAreas?: ServiceArea[];
}

export interface OperatorDashboard {
  profile: OperatorProfile;
  availableJobs: number;
  activeBids: number;
  wonJobs: number;
  completedJobs: number;
  totalEarnings: number;
  pendingPayouts: number;
}

export interface RegisterOperatorResponse {
  success: boolean;
  data: OperatorProfile;
  message: string;
}

export interface GetOperatorProfileResponse {
  success: boolean;
  data: OperatorProfile;
}

export interface GetOperatorDashboardResponse {
  success: boolean;
  data: OperatorDashboard;
}

