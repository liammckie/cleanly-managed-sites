
import { useQuery } from '@tanstack/react-query';
import { Quote } from '@/types/models';
import { fetchQuotes } from '@/lib/api/quotes';
import { adaptQuote } from '@/utils/typeAdapters';

export function useFetchQuotes() {
  return useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: async () => {
      const data = await fetchQuotes();
      return data.map(quote => adaptQuote(quote));
    },
  });
}
