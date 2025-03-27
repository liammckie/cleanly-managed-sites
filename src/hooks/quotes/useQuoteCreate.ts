
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuote } from '@/lib/api/quotes';
import { Quote } from '@/types/models';
import { toast } from 'sonner';

export function useQuoteCreate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (quoteData: Partial<Quote>) => createQuote(quoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });
  
  return {
    createQuote: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error
  };
}
