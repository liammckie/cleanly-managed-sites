
import { useState, useEffect } from 'react';
import { sitesApi } from '@/lib/api';

interface SiteResult {
  site: any;
  isLoading: boolean;
  error: Error | null;
}

export const useSite = (id?: string): SiteResult => {
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchSite = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Using the sitesApi.getSite method instead of a non-existent getSiteById
        const siteData = await sitesApi.getSite(id);
        setSite(siteData);
      } catch (err) {
        console.error('Error fetching site:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch site'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [id]);

  return { site, isLoading, error };
};
