
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapFromDb } from '@/lib/mappers';
import { toast } from 'sonner';

export function useQuote(quoteId: string | undefined) {
  const fetchQuote = async () => {
    if (!quoteId) return null;
    
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();
      
    if (error) {
      throw new Error(`Error fetching quote: ${error.message}`);
    }
    
    return mapFromDb(data);
  };

  const query = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: fetchQuote,
    enabled: !!quoteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // This provides a more user-friendly way to access the query fields
  return {
    quote: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
