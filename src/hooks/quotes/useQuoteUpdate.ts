
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Quote } from '@/types/models';
import { updateQuoteMutation } from '@/lib/api/quotes';
import { adaptQuote } from '@/utils/typeAdapters';

export function useQuoteUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (quoteData: Quote) => {
      // Cast Quote to the expected type for updateQuoteMutation using any
      const result = await updateQuoteMutation(quoteData as any);
      return adaptQuote(result);
    },
    onSuccess: (data: Quote) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', data.id] });
      toast.success('Quote updated successfully');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Failed to update quote: ${error.message}`);
    }
  });
  
  return {
    updateQuote: mutation.mutate,
    updateQuoteMutation: mutation,
    isUpdating: mutation.isPending,
    error: mutation.error
  };
}
