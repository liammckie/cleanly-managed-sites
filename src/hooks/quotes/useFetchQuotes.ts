
import { useQuery } from '@tanstack/react-query';
import { Quote } from '@/types/models';
import { fetchQuotes } from '@/lib/api/quotes/quotesApi';
import { ensureCompleteQuotes } from './useQuoteAdapter';

export function useFetchQuotes() {
  const query = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      try {
        const quotes = await fetchQuotes();
        // Ensure all quotes have the required properties
        return ensureCompleteQuotes(quotes);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
      }
    }
  });

  return {
    quotes: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
