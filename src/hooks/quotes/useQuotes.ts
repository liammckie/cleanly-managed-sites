
import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '@/lib/api/quotes';

export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
}
