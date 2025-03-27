
import { useQuery } from '@tanstack/react-query';
import { fetchOverheadProfiles } from '@/lib/api/quotes';
import { OverheadProfile } from '@/lib/utils/typeAdapters';

export function useOverheadProfiles() {
  return useQuery<OverheadProfile[]>({
    queryKey: ['overhead-profiles'],
    queryFn: fetchOverheadProfiles,
  });
}
