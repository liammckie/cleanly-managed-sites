
import { useQuery } from '@tanstack/react-query';
import { Quote } from '@/lib/types/quotes';
import { fetchQuotes } from '@/lib/api/quotes';

export function useFetchQuotes() {
  return useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
}
