
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Quote } from '@/types/models';
import { quotesApi } from '@/lib/api/quotes';

export function useQuoteCreate() {
  const queryClient = useQueryClient();

  const createQuoteMutation = useMutation({
    mutationFn: async (quoteData: Partial<Quote>) => {
      try {
        return await quotesApi.createQuoteMutation(quoteData);
      } catch (error: any) {
        console.error('Error creating quote:', error);
        throw new Error(error.message || 'Failed to create quote');
      }
    },
    onSuccess: () => {
      // Invalidate quotes queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error creating quote: ${error.message}`);
    }
  });

  // Helper method for easier access from components
  const createQuote = async (quoteData: Partial<Quote>) => {
    return createQuoteMutation.mutateAsync(quoteData);
  };

  return {
    createQuoteMutation,
    createQuote,
    isCreating: createQuoteMutation.isPending,
    error: createQuoteMutation.error
  };
}
