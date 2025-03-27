
import { useQuery } from '@tanstack/react-query';
import { Quote } from '@/types/models';
import { ensureCompleteQuote } from './useQuoteAdapter';
import { fetchQuote } from '@/lib/api/quotes/quotesApi';

export function useQuote(quoteId?: string) {
  const query = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: async () => {
      if (!quoteId) return null;
      try {
        const quote = await fetchQuote(quoteId);
        // Ensure the quote has all required properties
        return ensureCompleteQuote(quote);
      } catch (error) {
        console.error(`Error fetching quote ${quoteId}:`, error);
        return null;
      }
    },
    enabled: !!quoteId
  });

  return {
    quote: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  };
}
