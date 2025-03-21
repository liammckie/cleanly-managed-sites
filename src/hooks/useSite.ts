
import { useQuery } from '@tanstack/react-query';
import { sitesApi, SiteRecord } from '@/lib/api';

export function useSite(id?: string) {
  const {
    data: site,
    isLoading,
    error,
  } = useQuery<SiteRecord, Error>({
    queryKey: ['site', id],
    queryFn: () => {
      if (!id) throw new Error('Site ID is required');
      return sitesApi.getSiteById(id);
    },
    enabled: !!id,
  });

  return {
    site,
    isLoading,
    error,
  };
}
