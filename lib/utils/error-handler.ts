/**
 * Centralized Error Handling Utilities
 * Provides consistent error extraction and typing for API errors
 */

import { AxiosError } from 'axios';

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Standardized API error structure from backend
 */
export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
}

/**
 * Validation error detail from backend
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Typed error response from API
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * Error categories for different handling strategies
 */
export type ErrorCategory = 
  | 'network'
  | 'authentication' 
  | 'authorization'
  | 'validation'
  | 'not_found'
  | 'server'
  | 'timeout'
  | 'unknown';

/**
 * Parsed error with category and user-friendly message
 */
export interface ParsedError {
  category: ErrorCategory;
  message: string;
  code?: string;
  details?: ValidationError[];
  originalError: unknown;
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

const ERROR_MESSAGES: Record<ErrorCategory, string> = {
  network: 'Unable to connect. Please check your internet connection and try again.',
  authentication: 'Your session has expired. Please sign in again.',
  authorization: 'You do not have permission to perform this action.',
  validation: 'Please check your input and try again.',
  not_found: 'The requested resource was not found.',
  server: 'Something went wrong on our end. Please try again later.',
  timeout: 'The request took too long. Please try again.',
  unknown: 'An unexpected error occurred. Please try again.',
};

// ============================================================================
// ERROR PARSING FUNCTIONS
// ============================================================================

/**
 * Determine the category of an error based on status code and error type
 */
export function getErrorCategory(error: unknown): ErrorCategory {
  // Network errors (no response)
  if (error instanceof AxiosError) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return 'timeout';
      }
      return 'network';
    }

    const status = error.response.status;

    switch (status) {
      case 401:
        return 'authentication';
      case 403:
        return 'authorization';
      case 400:
      case 422:
        return 'validation';
      case 404:
        return 'not_found';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'server';
      default:
        return 'unknown';
    }
  }

  // Check if offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'network';
  }

  return 'unknown';
}

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error: unknown): string {
  // AxiosError with response data
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    
    // Standard API error format: { success: false, error: { message: '...' } }
    if (data.error?.message) {
      return data.error.message;
    }
    
    // Alternative format: { message: '...' }
    if (data.message) {
      return data.message;
    }

    // Array of validation errors
    if (Array.isArray(data.error?.details)) {
      return data.error.details.map((d: ValidationError) => d.message).join('. ');
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return ERROR_MESSAGES.unknown;
}

/**
 * Extract validation errors from API response
 */
export function extractValidationErrors(error: unknown): ValidationError[] {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    if (Array.isArray(data.error?.details)) {
      return data.error.details;
    }
  }
  return [];
}

/**
 * Parse error into a structured format with category and user-friendly message
 */
export function parseError(error: unknown): ParsedError {
  const category = getErrorCategory(error);

  // Get specific message from API or use default for category
  let message = extractErrorMessage(error);

  // For certain categories, prefer the default message if API message is too technical
  if (category === 'network' || category === 'timeout') {
    message = ERROR_MESSAGES[category];
  }

  // Extract additional details
  let code: string | undefined;
  let details: ValidationError[] | undefined;

  if (error instanceof AxiosError && error.response?.data?.error) {
    code = error.response.data.error.code;
    details = extractValidationErrors(error);
  }

  return {
    category,
    message,
    code,
    details: details?.length ? details : undefined,
    originalError: error,
  };
}

/**
 * Get a user-friendly message for common error scenarios
 * Provides context-specific messaging
 */
export type ErrorContext = 'fetch' | 'submit' | 'delete' | 'update' | 'payment';

export function getContextualErrorMessage(
  error: unknown,
  context: ErrorContext
): string {
  const parsed = parseError(error);

  // Use API-provided message for validation errors
  if (parsed.category === 'validation') {
    return parsed.message;
  }

  // Context-specific messages for other categories
  const contextMessages: Record<ErrorContext, Record<ErrorCategory, string>> = {
    fetch: {
      network: 'Unable to load data. Please check your connection.',
      authentication: 'Please sign in to view this content.',
      authorization: 'You do not have access to this content.',
      validation: parsed.message,
      not_found: 'The requested data could not be found.',
      server: 'Unable to load data. Please try again later.',
      timeout: 'Loading took too long. Please try again.',
      unknown: 'Failed to load data. Please try again.',
    },
    submit: {
      network: 'Unable to submit. Please check your connection.',
      authentication: 'Please sign in to continue.',
      authorization: 'You do not have permission to submit this.',
      validation: parsed.message,
      not_found: 'The resource no longer exists.',
      server: 'Unable to save. Please try again later.',
      timeout: 'Submission timed out. Please try again.',
      unknown: 'Failed to submit. Please try again.',
    },
    delete: {
      network: 'Unable to delete. Please check your connection.',
      authentication: 'Please sign in to continue.',
      authorization: 'You do not have permission to delete this.',
      validation: parsed.message,
      not_found: 'Item already deleted or does not exist.',
      server: 'Unable to delete. Please try again later.',
      timeout: 'Request timed out. Please try again.',
      unknown: 'Failed to delete. Please try again.',
    },
    update: {
      network: 'Unable to update. Please check your connection.',
      authentication: 'Please sign in to continue.',
      authorization: 'You do not have permission to update this.',
      validation: parsed.message,
      not_found: 'The item no longer exists.',
      server: 'Unable to save changes. Please try again later.',
      timeout: 'Update timed out. Please try again.',
      unknown: 'Failed to update. Please try again.',
    },
    payment: {
      network: 'Payment failed. Please check your connection and try again.',
      authentication: 'Please sign in to complete your payment.',
      authorization: 'You are not authorized to make this payment.',
      validation: parsed.message,
      not_found: 'Payment session expired. Please start again.',
      server: 'Payment processing failed. Please try again later.',
      timeout: 'Payment timed out. Please try again.',
      unknown: 'Payment failed. Please try again.',
    },
  };

  return contextMessages[context][parsed.category];
}

/**
 * Check if error is a specific category
 */
export function isNetworkError(error: unknown): boolean {
  return getErrorCategory(error) === 'network';
}

export function isAuthenticationError(error: unknown): boolean {
  return getErrorCategory(error) === 'authentication';
}

export function isValidationError(error: unknown): boolean {
  return getErrorCategory(error) === 'validation';
}

export function isNotFoundError(error: unknown): boolean {
  return getErrorCategory(error) === 'not_found';
}

export function isServerError(error: unknown): boolean {
  return getErrorCategory(error) === 'server';
}

