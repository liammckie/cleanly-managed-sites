
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Quote } from '@/types/models';
import { createQuoteMutation } from '@/lib/api/quotes/quotesApi';
import { adaptQuote } from '@/utils/typeAdapters';

export function useQuoteCreate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (quoteData: Partial<Quote>) => {
      const result = await createQuoteMutation(quoteData);
      return adaptQuote(result);
    },
    onSuccess: (data: Quote) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote created successfully');
      return data; // Return data so it can be used in the component
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
