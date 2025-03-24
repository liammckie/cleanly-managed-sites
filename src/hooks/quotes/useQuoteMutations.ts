
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createQuoteMutation, 
  updateQuoteMutation, 
  deleteQuoteMutation 
} from '@/lib/api/quotes';

export function useCreateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create quote: ' + error.message);
    }
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateQuoteMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', data.id] });
      toast.success('Quote updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update quote: ' + error.message);
    }
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete quote: ' + error.message);
    }
  });
}
