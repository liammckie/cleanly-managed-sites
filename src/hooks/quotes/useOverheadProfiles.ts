
import { useQuery } from '@tanstack/react-query';
import { fetchOverheadProfiles } from '@/lib/api/quotes';

export function useOverheadProfiles() {
  return useQuery({
    queryKey: ['overhead-profiles'],
    queryFn: fetchOverheadProfiles,
  });
}
