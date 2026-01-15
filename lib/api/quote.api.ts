/**
 * Quote API Service
 * Handles Google Maps and quote-related API calls
 */

import { apiClient } from './client';
import type {
  PlacePrediction,
  GeocodingResult,
  DistanceResult,
  SingleJourneyQuoteRequest,
  ReturnJourneyQuoteRequest,
  AllVehiclesQuoteRequest,
  SingleJourneyQuote,
  ReturnJourneyQuote,
  AllVehiclesQuoteResponse,
  AutocompleteResponse,
  PlaceDetailsResponse,
  DistanceResponse,
  SingleQuoteResponse,
  ReturnQuoteResponse,
  AllVehiclesQuoteApiResponse,
} from '@/lib/types';

// ============================================================================
// GOOGLE MAPS API ENDPOINTS
// ============================================================================

/**
 * Get address autocomplete suggestions
 * GET /api/maps/autocomplete?input=London&sessionToken=xxx
 */
export const getAutocomplete = async (
  input: string,
  sessionToken?: string
): Promise<PlacePrediction[]> => {
  const params = new URLSearchParams({ input });
  if (sessionToken) {
    params.append('sessionToken', sessionToken);
  }

  const response = await apiClient.get<AutocompleteResponse>(
    `/api/maps/autocomplete?${params.toString()}`
  );
  return response.data.data;
};

/**
 * Get place details by place ID
 * GET /api/maps/place-details?placeId=xxx
 */
export const getPlaceDetails = async (placeId: string): Promise<GeocodingResult | null> => {
  const response = await apiClient.get<PlaceDetailsResponse>(
    `/api/maps/place-details?placeId=${placeId}`
  );
  return response.data.data;
};

/**
 * Calculate distance between two points
 * GET /api/maps/distance?originLat=51.5&originLng=-0.1&destLat=51.4&destLng=-0.5
 */
export const calculateDistance = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DistanceResult | null> => {
  const params = new URLSearchParams({
    originLat: originLat.toString(),
    originLng: originLng.toString(),
    destLat: destLat.toString(),
    destLng: destLng.toString(),
  });

  const response = await apiClient.get<DistanceResponse>(
    `/api/maps/distance?${params.toString()}`
  );
  return response.data.data;
};

// ============================================================================
// QUOTE API ENDPOINTS
// ============================================================================

/**
 * Calculate quote for a single (one-way) journey
 * POST /api/maps/quote/single
 */
export const calculateSingleQuote = async (
  request: SingleJourneyQuoteRequest
): Promise<SingleJourneyQuote> => {
  const response = await apiClient.post<SingleQuoteResponse>(
    '/api/maps/quote/single',
    request
  );
  return response.data.data;
};

/**
 * Calculate quote for a return journey (outbound + return with discount)
 * POST /api/maps/quote/return
 */
export const calculateReturnQuote = async (
  request: ReturnJourneyQuoteRequest
): Promise<ReturnJourneyQuote> => {
  const response = await apiClient.post<ReturnQuoteResponse>(
    '/api/maps/quote/return',
    request
  );
  return response.data.data;
};

/**
 * Calculate quotes for all available vehicles in a single request
 * POST /api/maps/quote/all-vehicles
 */
export const calculateAllVehiclesQuote = async (
  request: AllVehiclesQuoteRequest
): Promise<AllVehiclesQuoteResponse> => {
  const response = await apiClient.post<AllVehiclesQuoteApiResponse>(
    '/api/maps/quote/all-vehicles',
    request
  );
  return response.data.data;
};

