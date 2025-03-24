
import { useQuery } from '@tanstack/react-query';
import { fetchQuote } from '@/lib/api/quotes';

export function useQuote(quoteId: string) {
  return useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => fetchQuote(quoteId),
    enabled: !!quoteId,
  });
}
