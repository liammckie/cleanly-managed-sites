
import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '@/lib/api/quotes';
import { Quote } from '@/types/models';
import { adaptQuote } from '@/utils/typeAdapters';

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: async () => {
      const data = await fetchQuotes();
      return data.map(quote => adaptQuote(quote));
    },
  });
}
