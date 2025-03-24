
import { useQuery } from '@tanstack/react-query';
import { fetchAllowances } from '@/lib/api/quotes';

export function useAllowances() {
  return useQuery({
    queryKey: ['allowances'],
    queryFn: fetchAllowances,
  });
}
