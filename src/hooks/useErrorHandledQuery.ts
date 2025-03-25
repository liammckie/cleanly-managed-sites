
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseError } from '@/lib/utils/errorHandling';

export function useErrorHandledQuery<TData, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> & {
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
    onError: (error) => {
      const parsedError = parseError(error);
      console.error(`Query error [${queryKey.join(', ')}]:`, parsedError);
      
      if (showErrorToast) {
        toast.error(errorMessage, {
          description: parsedError.message,
        });
      }
      
      // Call the user's onError if provided
      queryOptions.onError?.(error);
    },
    ...queryOptions,
  });
}

export default useErrorHandledQuery;
