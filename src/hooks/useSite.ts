
import { useState, useEffect, useCallback } from 'react';
import { sitesApi } from '@/lib/api';

interface SiteResult {
  site: any;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useSite = (id?: string): SiteResult => {
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSite = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Using the sitesApi.getSiteById method
      const siteData = await sitesApi.getSiteById(id);
      setSite(siteData);
    } catch (err) {
      console.error('Error fetching site:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch site'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSite();
  }, [fetchSite]);

  return { 
    site, 
    isLoading, 
    error,
    refetch: fetchSite 
  };
};
