
import { useErrorHandledQuery } from './useErrorHandledQuery';
import { sitesApi } from '@/lib/api/sites';
import { SiteRecord } from '@/lib/types';
import { useCallback } from 'react';

/**
 * Hook to fetch and manage sites data
 */
export function useSites() {
  // Use the error-handled query hook
  const query = useErrorHandledQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      try {
        return await sitesApi.getSites();
      } catch (error) {
        console.error('Error fetching sites:', error);
        throw error;
      }
    },
    errorMessage: 'Failed to load sites'
  });

  // Provide a simple function to refresh sites data
  const refreshSites = useCallback(() => {
    query.refetch();
  }, [query]);

  // Filter sites by client ID
  const filterByClient = useCallback((clientId: string) => {
    if (!query.data) return [];
    return query.data.filter(site => site.client_id === clientId);
  }, [query.data]);

  // Get active sites
  const getActiveSites = useCallback(() => {
    if (!query.data) return [];
    return query.data.filter(site => site.status === 'active');
  }, [query.data]);

  // Get sites statistics
  const getSiteStatistics = useCallback(() => {
    if (!query.data) return { total: 0, active: 0, pending: 0, inactive: 0 };
    
    const total = query.data.length;
    const active = query.data.filter(site => site.status === 'active').length;
    const pending = query.data.filter(site => site.status === 'pending').length;
    const inactive = query.data.filter(site => site.status === 'inactive').length;
    
    return { total, active, pending, inactive };
  }, [query.data]);

  // Calculate total monthly revenue across all sites
  const calculateTotalMonthlyRevenue = useCallback(() => {
    if (!query.data) return 0;
    return query.data.reduce((total, site) => total + (site.monthly_revenue || 0), 0);
  }, [query.data]);

  // Search sites by name, address, or client
  const searchSites = useCallback((searchTerm: string) => {
    if (!query.data || !searchTerm) return query.data || [];
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return query.data.filter(site => 
      site.name.toLowerCase().includes(normalizedSearchTerm) ||
      (site.address && site.address.toLowerCase().includes(normalizedSearchTerm)) ||
      (site.client_name && site.client_name.toLowerCase().includes(normalizedSearchTerm))
    );
  }, [query.data]);

  // Return all the data and utility functions
  return {
    ...query,
    data: query.data as SiteRecord[] | undefined,
    refreshSites,
    filterByClient,
    getActiveSites,
    getSiteStatistics,
    calculateTotalMonthlyRevenue,
    searchSites
  };
}

/**
 * Hook to fetch a single site by ID
 */
export function useSite(siteId?: string) {
  const query = useErrorHandledQuery({
    queryKey: ['site', siteId],
    queryFn: async () => {
      if (!siteId) return null;
      try {
        return await sitesApi.getSiteById(siteId);
      } catch (error) {
        console.error(`Error fetching site ${siteId}:`, error);
        throw error;
      }
    },
    errorMessage: 'Failed to load site details',
    enabled: !!siteId
  });

  return {
    site: query.data as SiteRecord | null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
