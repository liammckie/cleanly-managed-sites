
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuote, updateQuote, deleteQuote } from '@/lib/api/quotes';
import { Quote } from '@/types/models';
import { toast } from 'sonner';

// Hook for creating quotes
export const useQuoteCreate = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (quoteData: Partial<Quote>) => createQuote(quoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create quote: ${error.message}`);
      console.error('Quote creation error:', error);
    }
  });
  
  return {
    createQuote: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error
  };
};

// Hook for updating quotes
export const useQuoteUpdate = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<Quote> }) => 
      updateQuote(params.id, params.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
      toast.success('Quote updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update quote: ${error.message}`);
      console.error('Quote update error:', error);
    }
  });
  
  return {
    updateQuote: (data: Partial<Quote> & { id: string }) => 
      mutation.mutate({ id: data.id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error
  };
};

// Hook for deleting quotes
export const useQuoteDelete = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (quoteId: string) => deleteQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete quote: ${error.message}`);
      console.error('Quote deletion error:', error);
    }
  });
  
  return {
    deleteQuote: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error
  };
};
