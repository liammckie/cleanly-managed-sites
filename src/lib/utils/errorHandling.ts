
import { toast } from 'sonner';

export interface ApiError extends Error {
  status?: number;
  code?: string;
  data?: any;
}

/**
 * Creates a standardized API error with additional metadata
 */
export function createApiError(message: string, status?: number, code?: string, data?: any): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code;
  error.data = data;
  return error;
}

/**
 * Handle errors from API calls consistently
 */
export async function handleApiError<T>(
  promise: Promise<T>,
  {
    errorMessage = 'An error occurred',
    showToast = true,
    rethrow = true,
    logError = true,
  }: {
    errorMessage?: string;
    showToast?: boolean;
    rethrow?: boolean;
    logError?: boolean;
  } = {}
): Promise<T | null> {
  try {
    return await promise;
  } catch (error: any) {
    // Format error message
    const status = error.status || (error.response?.status ? `${error.response.status}` : undefined);
    const code = error.code || error.errorCode || 'ERROR';
    const errorDetail = error.message || (typeof error === 'string' ? error : 'Unknown error');
    const fullMessage = `${errorMessage}: ${errorDetail}`;
    
    // Log error
    if (logError) {
      console.error(`API Error [${code}${status ? ` ${status}` : ''}]:`, error);
    }
    
    // Show toast notification
    if (showToast) {
      toast.error(errorMessage, {
        description: errorDetail,
        duration: 5000,
      });
    }
    
    // Create standardized error
    const apiError = createApiError(
      fullMessage,
      typeof status === 'string' ? parseInt(status, 10) : undefined,
      code,
      error.data || error.response?.data
    );
    
    // Rethrow or return null
    if (rethrow) {
      throw apiError;
    }
    
    return null;
  }
}

/**
 * Utility function to create a wrapper that adds error handling to API functions
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  defaultErrorMessage: string
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      return handleApiError(
        Promise.reject(error),
        { errorMessage: defaultErrorMessage, rethrow: true }
      );
    }
  };
}

/**
 * Parse error from different sources into a standard format
 */
export function parseError(error: any): ApiError {
  if (!error) {
    return createApiError('Unknown error occurred');
  }
  
  if (error instanceof Error) {
    return error as ApiError;
  }
  
  if (typeof error === 'string') {
    return createApiError(error);
  }
  
  if (error.message) {
    return createApiError(
      error.message,
      error.status || error.statusCode,
      error.code || error.errorCode,
      error.data
    );
  }
  
  return createApiError(
    JSON.stringify(error).substring(0, 100),
    undefined,
    undefined,
    error
  );
}
