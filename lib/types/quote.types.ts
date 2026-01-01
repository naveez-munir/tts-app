/**
 * Quote Types
 * Matches backend types from tts-api/src/integrations/google-maps/quote.service.ts
 */

import { VehicleType } from './enums';

// ============================================================================
// GOOGLE MAPS TYPES
// ============================================================================

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  postcode: string | null;
}

export interface DistanceResult {
  distanceMeters: number;
  distanceMiles: number;
  durationSeconds: number;
  durationMinutes: number;
}

// ============================================================================
// QUOTE REQUEST TYPES
// ============================================================================

export interface SingleJourneyQuoteRequest {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  vehicleType: VehicleType;
  pickupDatetime: string;
  meetAndGreet?: boolean;
}

export interface ReturnJourneyQuoteRequest {
  outbound: SingleJourneyQuoteRequest;
  returnJourney: SingleJourneyQuoteRequest;
}

// ============================================================================
// QUOTE RESPONSE TYPES
// ============================================================================

export interface QuoteBreakdown {
  baseFare: string;
  perMileRate: string;
  distanceMiles: string;
  distanceCharge: string;
  timeSurchargePercent: string;
  holidaySurchargePercent: string;
  meetAndGreetFee: string;
  returnDiscountPercent: string;
  subtotal: string;
  total: string;
}

export interface SingleJourneyQuote {
  baseFare: number;
  distanceCharge: number;
  timeSurcharge: number;
  holidaySurcharge: number;
  meetAndGreetFee: number;
  totalPrice: number;
  distance: DistanceResult | null;
  breakdown: QuoteBreakdown;
}

export interface ReturnJourneyQuote {
  outbound: SingleJourneyQuote;
  returnJourney: SingleJourneyQuote;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface AutocompleteResponse {
  success: boolean;
  data: PlacePrediction[];
}

export interface PlaceDetailsResponse {
  success: boolean;
  data: GeocodingResult | null;
}

export interface DistanceResponse {
  success: boolean;
  data: DistanceResult | null;
}

export interface SingleQuoteResponse {
  success: boolean;
  data: SingleJourneyQuote;
}

export interface ReturnQuoteResponse {
  success: boolean;
  data: ReturnJourneyQuote;
}

