
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseError } from '@/lib/utils/errorHandling';

export function useErrorHandledQuery<TData, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, string[]>, 'queryKey' | 'queryFn'> & {
    errorMessage?: string;
    showErrorToast?: boolean;
  }
): UseQueryResult<TData, TError> {
  const {
    errorMessage = 'Failed to load data',
    showErrorToast = true,
    ...queryOptions
  } = options || {};

  return useQuery({
    queryKey,
    queryFn,
    ...queryOptions,
    meta: {
      ...queryOptions.meta,
      errorCallback: (error: unknown) => {
        const parsedError = parseError(error);
        console.error(`Query error [${queryKey.join(', ')}]:`, parsedError);
        
        if (showErrorToast) {
          toast.error(errorMessage, {
            description: parsedError.message,
          });
        }
        
        // Call the user's onError callback if provided in meta
        if (queryOptions.meta?.errorCallback) {
          queryOptions.meta.errorCallback(error);
        }
      }
    }
  });
}

export default useErrorHandledQuery;
