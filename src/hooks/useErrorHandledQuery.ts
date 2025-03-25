
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from './useAsyncData';

/**
 * A wrapper for react-query's useQuery that provides consistent error handling
 */
export function useErrorHandledQuery<
  TData,
  TError = Error,
  TQueryKey extends Array<any> = Array<any>
>(
  queryOptions: Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, 'onError'> & {
    errorMessage?: string;
    showErrorToast?: boolean;
    onCustomError?: (error: TError) => void;
  }
): UseQueryResult<TData, TError> {
  const {
    errorMessage = 'An error occurred while fetching data',
    showErrorToast = true,
    onCustomError,
    ...restOptions
  } = queryOptions;

  // Handle errors via the meta property as per v5 of react-query
  const options: UseQueryOptions<TData, TError, TData, TQueryKey> = {
    ...restOptions,
    meta: {
      ...restOptions.meta,
      onError: (error: TError) => {
        // Show error toast if enabled
        if (showErrorToast) {
          toast.error(`${errorMessage}: ${getErrorMessage(error)}`);
        }
        
        // Call custom error handler if provided
        if (onCustomError) {
          onCustomError(error);
        }
        
        // Call the original onError if provided in meta
        if (restOptions.meta?.onError) {
          const metaOnError = restOptions.meta.onError as Function;
          metaOnError(error);
        }
      }
    }
  };

  // Use react-query's useQuery with our enhanced error handling
  return useQuery<TData, TError, TData, TQueryKey>(options);
}
