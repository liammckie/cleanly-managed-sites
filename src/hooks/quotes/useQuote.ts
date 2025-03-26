
import { useQuery } from '@tanstack/react-query';
import { Quote } from '@/types/models';
import { fetchQuote } from '@/lib/api/quotes';
import { adaptQuote } from '@/utils/typeAdapters';

export function useQuote(id: string) {
  return useQuery<Quote>({
    queryKey: ['quote', id],
    queryFn: async () => {
      if (!id) return Promise.reject('No quote ID provided');
      const data = await fetchQuote(id);
      return adaptQuote(data);
    },
    enabled: !!id
  });
}
