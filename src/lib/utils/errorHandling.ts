
import { toast } from 'sonner';

/**
 * Wraps a function with error handling
 * @param fn The function to wrap
 * @param errorMessage Default error message to show
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage = 'An error occurred'
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, errorMessage);
      throw error;
    }
  };
}

/**
 * Handles API errors consistently
 * @param error The caught error
 * @param defaultMessage Default message if error doesn't have one
 */
export function handleApiError(error: unknown, defaultMessage = 'An error occurred') {
  console.error('API Error:', error);
  
  let errorMessage = defaultMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  }
  
  toast.error(errorMessage);
  return errorMessage;
}
