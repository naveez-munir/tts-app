/**
 * Shared Enums - Must match backend Prisma schema exactly
 * Source: tts-api/prisma/schema.prisma
 */

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
}

export enum VehicleType {
  SALOON = 'SALOON',
  ESTATE = 'ESTATE',
  MPV = 'MPV',
  EXECUTIVE = 'EXECUTIVE',
  MINIBUS = 'MINIBUS',
}

export enum ServiceType {
  AIRPORT_PICKUP = 'AIRPORT_PICKUP',
  AIRPORT_DROPOFF = 'AIRPORT_DROPOFF',
  POINT_TO_POINT = 'POINT_TO_POINT',
}

export enum JourneyType {
  ONE_WAY = 'ONE_WAY',
  OUTBOUND = 'OUTBOUND',
  RETURN = 'RETURN',
}

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum BookingGroupStatus {
  ACTIVE = 'ACTIVE',
  PARTIALLY_CANCELLED = 'PARTIALLY_CANCELLED',
  FULLY_CANCELLED = 'FULLY_CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum JobStatus {
  OPEN_FOR_BIDDING = 'OPEN_FOR_BIDDING',
  BIDDING_CLOSED = 'BIDDING_CLOSED',
  NO_BIDS_RECEIVED = 'NO_BIDS_RECEIVED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BidStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  WITHDRAWN = 'WITHDRAWN',
}

export enum DiscountType {
  RETURN_JOURNEY = 'RETURN_JOURNEY',
  PROMOTIONAL = 'PROMOTIONAL',
}

export enum TransactionType {
  CUSTOMER_PAYMENT = 'CUSTOMER_PAYMENT',
  OPERATOR_PAYOUT = 'OPERATOR_PAYOUT',
  REFUND = 'REFUND',
  PLATFORM_COMMISSION = 'PLATFORM_COMMISSION',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum DocumentType {
  OPERATING_LICENSE = 'OPERATING_LICENSE',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum OperatorApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

