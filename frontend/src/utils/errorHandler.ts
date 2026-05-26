/**
 * Error handling utilities for the frontend
 */

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message: string;
}

/**
 * Extract error message from various error formats
 * @param error - The error object
 * @param defaultMessage - Default message if no specific message found
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (!error) return defaultMessage;
  
  const apiError = error as ApiError;
  
  // Check for API error response
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  
  // Check for standard error message
  if (apiError.message) {
    return apiError.message;
  }
  
  // Check for string error
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};

/**
 * Check if error is a network error
 * @param error - The error object
 * @returns True if network error
 */
export const isNetworkError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return !apiError.response || apiError.message === 'Network Error';
};

/**
 * Check if error is an authentication error (401 or 403)
 * @param error - The error object
 * @returns True if auth error
 */
export const isAuthError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  const status = apiError.response?.status;
  return status === 401 || status === 403;
};

/**
 * Check if error is a validation error (400)
 * @param error - The error object
 * @returns True if validation error
 */
export const isValidationError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return apiError.response?.status === 400;
};

/**
 * Check if error is a conflict error (409)
 * @param error - The error object
 * @returns True if conflict error
 */
export const isConflictError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return apiError.response?.status === 409;
};

/**
 * Check if error is a not found error (404)
 * @param error - The error object
 * @returns True if not found error
 */
export const isNotFoundError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return apiError.response?.status === 404;
};
