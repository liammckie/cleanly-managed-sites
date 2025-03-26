
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Quote } from '@/types/models';
import { quotesApi } from '@/lib/api/quotes';

export function useQuoteUpdate() {
  const queryClient = useQueryClient();

  const updateQuoteMutation = useMutation({
    mutationFn: async (quoteData: Quote) => {
      try {
        return await quotesApi.updateQuoteMutation(quoteData);
      } catch (error: any) {
        console.error('Error updating quote:', error);
        throw new Error(error.message || 'Failed to update quote');
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch quotes queries
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', data.id] });
      toast.success('Quote updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating quote: ${error.message}`);
    }
  });

  // Helper method for easier access from components
  const updateQuote = async (quoteData: Quote) => {
    return updateQuoteMutation.mutateAsync(quoteData);
  };

  return {
    updateQuoteMutation,
    updateQuote,
    isUpdating: updateQuoteMutation.isPending,
    error: updateQuoteMutation.error
  };
}
