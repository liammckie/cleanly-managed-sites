
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuote } from '@/lib/api/quotes';
import { toast } from 'sonner';

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (quoteId: string) => deleteQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete quote: ${error.message}`);
    }
  });
  
  return {
    deleteQuote: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error
  };
}
