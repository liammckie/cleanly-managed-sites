
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi, SiteRecord } from '@/lib/api';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

export function useSites() {
  const queryClient = useQueryClient();
  
  // Query for fetching all sites
  const sitesQuery = useQuery({
    queryKey: ['sites'],
    queryFn: sitesApi.getSites,
  });
  
  // Mutation for creating a new site
  const createSiteMutation = useMutation({
    mutationFn: (siteData: SiteFormData) => sitesApi.createSite(siteData),
    onSuccess: () => {
      // Invalidate the sites query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating site:', error);
      toast.error(`Failed to create site: ${error.message}`);
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
      console.error('Error updating site:', error);
      toast.error(`Failed to update site: ${error.message}`);
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
      console.error('Error deleting site:', error);
      toast.error(`Failed to delete site: ${error.message}`);
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
  const siteQuery = useQuery({
    queryKey: ['site', siteId],
    queryFn: () => siteId ? sitesApi.getSiteById(siteId) : null,
    enabled: !!siteId, // Only run the query if siteId is provided
  });
  
  // Mutation for updating a site
  const updateSiteMutation = useMutation({
    mutationFn: (data: Partial<SiteFormData>) => 
      siteId ? sitesApi.updateSite(siteId, data) : Promise.reject('No site ID provided'),
    onSuccess: () => {
      // Invalidate both the sites list and the current site detail
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', siteId] });
      toast.success('Site updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating site:', error);
      toast.error(`Failed to update site: ${error.message}`);
    },
  });
  
  return {
    site: siteQuery.data as SiteRecord | null,
    isLoading: siteQuery.isLoading,
    isError: siteQuery.isError,
    error: siteQuery.error,
    updateSite: updateSiteMutation.mutate,
    isUpdating: updateSiteMutation.isPending,
  };
}
