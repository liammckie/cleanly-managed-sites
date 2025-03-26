
import { useQuery } from '@tanstack/react-query';
import { fetchQuote } from '@/lib/api/quotes';
import { Quote } from '@/types/models';
import { adaptQuote } from '@/utils/typeAdapters';

export function useQuote(quoteId: string) {
  return useQuery<Quote>({
    queryKey: ['quote', quoteId],
    queryFn: async () => {
      const data = await fetchQuote(quoteId);
      return adaptQuote(data);
    },
    enabled: !!quoteId,
  });
}
