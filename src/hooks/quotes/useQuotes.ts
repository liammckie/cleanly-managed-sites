
import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '@/lib/api/quotes';
import { Quote } from '@/lib/types/quotes';

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
}
