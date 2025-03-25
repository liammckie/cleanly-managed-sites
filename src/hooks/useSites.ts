
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { useErrorHandledQuery } from './useErrorHandledQuery';
import { parseError } from '@/lib/utils/errorHandling';

export function useSites() {
  const queryClient = useQueryClient();
  
  // Query for fetching all sites using our error-handled query
  const sitesQuery = useErrorHandledQuery(
    ['sites'],
    sitesApi.getSites,
    {
      errorMessage: 'Failed to load sites',
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    }
  );
  
  // Mutation for creating a new site
  const createSiteMutation = useMutation({
    mutationFn: (siteData: SiteFormData) => sitesApi.createSite(siteData),
    onSuccess: () => {
      // Invalidate the sites query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully');
    },
    onError: (error: any) => {
      const parsedError = parseError(error);
      console.error('Error creating site:', parsedError);
      toast.error('Failed to create site', {
        description: parsedError.message || 'Unknown error',
      });
    },
  });
  
  // Mutation for updating a site
  const updateSiteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SiteFormData> }) => 
      sitesApi.updateSite(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site updated successfully');
    },
    onError: (error: any) => {
      const parsedError = parseError(error);
      console.error('Error updating site:', parsedError);
      toast.error('Failed to update site', {
        description: parsedError.message || 'Unknown error',
      });
    },
  });
  
  // Mutation for deleting a site
  const deleteSiteMutation = useMutation({
    mutationFn: (id: string) => sitesApi.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site deleted successfully');
    },
    onError: (error: any) => {
      const parsedError = parseError(error);
      console.error('Error deleting site:', parsedError);
      toast.error('Failed to delete site', {
        description: parsedError.message || 'Unknown error',
      });
    },
  });
  
  return {
    sites: sitesQuery.data || [],
    isLoading: sitesQuery.isLoading,
    isError: sitesQuery.isError,
    error: sitesQuery.error,
    createSite: createSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate,
    deleteSite: deleteSiteMutation.mutate,
    isCreating: createSiteMutation.isPending,
    isUpdating: updateSiteMutation.isPending,
    isDeleting: deleteSiteMutation.isPending,
  };
}

export function useSiteDetails(siteId: string | undefined) {
  const queryClient = useQueryClient();
  
  // Query for fetching a single site by ID
  const siteQuery = useErrorHandledQuery(
    ['site', siteId || ''],
    () => siteId ? sitesApi.getSiteById(siteId) : Promise.resolve(null),
    {
      errorMessage: 'Failed to load site details',
      enabled: !!siteId, // Only run the query if siteId is provided
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    }
  );
  
  // Mutation for updating a site
  const updateSiteMutation = useMutation({
    mutationFn: (data: Partial<SiteFormData>) => 
      siteId ? sitesApi.updateSite(siteId, data) : Promise.reject(new Error('No site ID provided')),
    onSuccess: () => {
      // Invalidate both the sites list and the current site detail
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', siteId] });
      toast.success('Site updated successfully');
    },
    onError: (error: any) => {
      const parsedError = parseError(error);
      console.error('Error updating site:', parsedError);
      toast.error('Failed to update site', {
        description: parsedError.message || 'Unknown error',
      });
    },
  });
  
  return {
    site: siteQuery.data,
    isLoading: siteQuery.isLoading,
    isError: siteQuery.isError,
    error: siteQuery.error,
    updateSite: updateSiteMutation.mutate,
    isUpdating: updateSiteMutation.isPending,
  };
}
