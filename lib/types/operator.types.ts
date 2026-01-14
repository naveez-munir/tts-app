/**
 * Operator Types
 * Matches backend DTOs from tts-api/src/modules/operators/dto/
 */

import { z } from 'zod';
import { VehicleType, VehiclePhotoType, OperatorApprovalStatus, DocumentType } from './enums';

// ============================================================================
// ZOD SCHEMAS (for form validation)
// ============================================================================

export const RegisterOperatorSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  vatNumber: z.string().optional(),
  operatingLicenseNumber: z.string().optional(),
  councilRegistration: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPostcode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  fleetSize: z.number().int().positive().optional(),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area required'),
  vehicleTypes: z.array(
    z.enum([
      'SALOON',
      'ESTATE',
      'MPV',
      'EXECUTIVE',
      'EXECUTIVE_LUXURY',
      'EXECUTIVE_PEOPLE_CARRIER',
      'GREEN_CAR',
      'MINIBUS',
    ])
  ),
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

export const UpdateOperatorProfileSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').optional(),
  vatNumber: z.string().optional(),
  operatingLicenseNumber: z.string().optional(),
  councilRegistration: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPostcode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  fleetSize: z.number().int().positive().optional().nullable(),
  vehicleTypes: z.array(
    z.enum([
      'SALOON',
      'ESTATE',
      'MPV',
      'EXECUTIVE',
      'EXECUTIVE_LUXURY',
      'EXECUTIVE_PEOPLE_CARRIER',
      'GREEN_CAR',
      'MINIBUS',
    ])
  ).optional(),
});

export const CreateVehicleSchema = z.object({
  vehicleType: z.enum([
    'SALOON',
    'ESTATE',
    'MPV',
    'EXECUTIVE',
    'EXECUTIVE_LUXURY',
    'EXECUTIVE_PEOPLE_CARRIER',
    'GREEN_CAR',
    'MINIBUS',
  ]),
  registrationPlate: z.string().min(1, 'Registration plate is required'),
  make: z.string().min(1, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  logbookUrl: z.string().optional(),
  motCertificateUrl: z.string().optional(),
  motExpiryDate: z.string().optional(),
  insuranceDocumentUrl: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
  hirePermissionLetterUrl: z.string().optional(),
});

export const UpdateVehicleSchema = z.object({
  vehicleType: z.enum([
    'SALOON',
    'ESTATE',
    'MPV',
    'EXECUTIVE',
    'EXECUTIVE_LUXURY',
    'EXECUTIVE_PEOPLE_CARRIER',
    'GREEN_CAR',
    'MINIBUS',
  ]).optional(),
  registrationPlate: z.string().min(1).optional(),
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().optional(),
  logbookUrl: z.string().optional(),
  motCertificateUrl: z.string().optional(),
  motExpiryDate: z.string().optional(),
  insuranceDocumentUrl: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
  hirePermissionLetterUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from schemas)
// ============================================================================

export type RegisterOperatorDto = z.infer<typeof RegisterOperatorSchema>;
export type UpdateBankDetailsDto = z.infer<typeof UpdateBankDetailsSchema>;
export type UpdateOperatorProfileDto = z.infer<typeof UpdateOperatorProfileSchema>;
export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof UpdateVehicleSchema>;

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
  color?: string;
  logbookUrl?: string;
  motCertificateUrl?: string;
  motExpiryDate?: string;
  insuranceDocumentUrl?: string;
  insuranceExpiryDate?: string;
  hirePermissionLetterUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  photos?: VehiclePhoto[];
}

export interface VehiclePhoto {
  id: string;
  vehicleId: string;
  photoType: VehiclePhotoType;
  photoUrl: string;
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
  documentType: DocumentType;
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
  operatingLicenseNumber: string | null;
  councilRegistration: string | null;
  businessAddress: string | null;
  businessPostcode: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  fleetSize: number | null;
  vehicleTypes?: VehicleType[];
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

// ============================================================================
// DRIVER TYPES
// ============================================================================

export const CreateDriverSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  profileImageUrl: z.string().optional(),
  dateOfBirth: z.string().optional(),
  // Passport documents
  passportUrl: z.string().optional(),
  passportExpiry: z.string().optional(),
  // Driving License documents
  drivingLicenseNumber: z.string().optional(),
  drivingLicenseFrontUrl: z.string().optional(),
  drivingLicenseBackUrl: z.string().optional(),
  drivingLicenseExpiry: z.string().optional(),
  // National Insurance
  nationalInsuranceNo: z.string().optional(),
  nationalInsuranceDocUrl: z.string().optional(),
  // Taxi Certification
  taxiCertificationUrl: z.string().optional(),
  taxiCertificationExpiry: z.string().optional(),
  // Taxi Badge
  taxiBadgePhotoUrl: z.string().optional(),
  taxiBadgeExpiry: z.string().optional(),
  // PHV License
  phvLicenseNumber: z.string().optional(),
  phvLicenseExpiry: z.string().optional(),
  issuingCouncil: z.string().optional(),
  badgeNumber: z.string().optional(),
});

export const UpdateDriverSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phoneNumber: z.string().min(1, 'Phone number is required').optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  profileImageUrl: z.string().optional(),
  dateOfBirth: z.string().optional(),
  // Passport documents
  passportUrl: z.string().optional(),
  passportExpiry: z.string().optional(),
  // Driving License documents
  drivingLicenseNumber: z.string().optional(),
  drivingLicenseFrontUrl: z.string().optional(),
  drivingLicenseBackUrl: z.string().optional(),
  drivingLicenseExpiry: z.string().optional(),
  // National Insurance
  nationalInsuranceNo: z.string().optional(),
  nationalInsuranceDocUrl: z.string().optional(),
  // Taxi Certification
  taxiCertificationUrl: z.string().optional(),
  taxiCertificationExpiry: z.string().optional(),
  // Taxi Badge
  taxiBadgePhotoUrl: z.string().optional(),
  taxiBadgeExpiry: z.string().optional(),
  // PHV License
  phvLicenseNumber: z.string().optional(),
  phvLicenseExpiry: z.string().optional(),
  issuingCouncil: z.string().optional(),
  badgeNumber: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateDriverDto = z.infer<typeof CreateDriverSchema>;
export type UpdateDriverDto = z.infer<typeof UpdateDriverSchema>;

export interface Driver {
  id: string;
  operatorId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  profileImageUrl: string | null;
  dateOfBirth: string | null;
  // Passport documents
  passportUrl: string | null;
  passportExpiry: string | null;
  // Driving License documents
  drivingLicenseNumber: string | null;
  drivingLicenseFrontUrl: string | null;
  drivingLicenseBackUrl: string | null;
  drivingLicenseExpiry: string | null;
  // National Insurance
  nationalInsuranceNo: string | null;
  nationalInsuranceDocUrl: string | null;
  // Taxi Certification
  taxiCertificationUrl: string | null;
  taxiCertificationExpiry: string | null;
  // Taxi Badge
  taxiBadgePhotoUrl: string | null;
  taxiBadgeExpiry: string | null;
  // PHV License
  phvLicenseNumber: string | null;
  phvLicenseExpiry: string | null;
  issuingCouncil: string | null;
  badgeNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDriversResponse {
  success: boolean;
  data: Driver[];
}

export interface GetDriverResponse {
  success: boolean;
  data: Driver;
}

export interface CreateDriverResponse {
  success: boolean;
  data: Driver;
  message: string;
}

export interface UpdateDriverResponse {
  success: boolean;
  data: Driver;
  message: string;
}

export interface DeleteDriverResponse {
  success: boolean;
  data: { deleted: boolean; driverId: string };
  message: string;
}

