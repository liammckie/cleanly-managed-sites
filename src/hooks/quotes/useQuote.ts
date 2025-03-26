
import { useQuery } from '@tanstack/react-query';
import { fetchQuote } from '@/lib/api/quotes';
import { Quote } from '@/lib/types/quotes';

export function useQuote(quoteId: string) {
  return useQuery<Quote>({
    queryKey: ['quote', quoteId],
    queryFn: () => fetchQuote(quoteId),
    enabled: !!quoteId,
  });
}
