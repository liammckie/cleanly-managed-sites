
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteQuoteMutation } from '@/lib/api/quotes';

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (quoteId: string) => {
      await deleteQuoteMutation(quoteId);
      return quoteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete quote: ${error.message}`);
    }
  });
  
  return mutation;
}
