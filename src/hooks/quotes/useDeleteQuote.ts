
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuote } from '@/lib/api/quotes';
import { toast } from 'sonner';

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (quoteId: string) => {
      await deleteQuote(quoteId);
      return quoteId; // Return the ID for easier access in onSuccess
    },
    onSuccess: (quoteId) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete quote: ${error.message}`);
    }
  });
  
  return {
    deleteQuote: mutation.mutate,
    deleteQuoteAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
