
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuote } from '@/lib/api/quotes';
import { Quote } from '@/types/models';
import { toast } from 'sonner';

export function useQuoteUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<Quote> }) => 
      updateQuote(params.id, params.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
    }
  });
  
  return {
    updateQuote: (data: Partial<Quote> & { id: string }) => 
      mutation.mutate({ id: data.id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error
  };
}
