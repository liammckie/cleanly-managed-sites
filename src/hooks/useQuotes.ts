
import { useQuery } from '@tanstack/react-query';
import { Quote } from '@/types/models';
import { fetchQuotes } from '@/lib/api/quotes';
import { adaptQuote } from '@/utils/typeAdapters';
import { QuoteDTO } from '@/types/dto';

export { useDeleteQuote } from './quotes/useDeleteQuote';

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: async () => {
      const data = await fetchQuotes();
      // Convert DTO to frontend Quote type
      return data.map(quote => {
        const adaptedQuote = adaptQuote(quote);
        // Type assertion to override the status type issue
        return adaptedQuote as unknown as Quote;
      });
    }
  });
}
