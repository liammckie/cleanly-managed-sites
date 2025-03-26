
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Quote } from '@/types/models';
import { createQuoteMutation } from '@/lib/api/quotes/quotesApi';

export function useQuoteCreate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create quote: ${error.message}`);
    }
  });
  
  return {
    createQuote: mutation.mutate,
    createQuoteMutation: mutation,
    isCreating: mutation.isPending,
    error: mutation.error
  };
}
