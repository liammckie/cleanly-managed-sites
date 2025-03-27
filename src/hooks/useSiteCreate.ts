
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SiteFormData } from '@/types/models';
import { sitesApi } from '@/lib/api/sites';
import { convertToModelSiteFormData } from '@/utils/siteFormAdapters';

export const useSiteCreate = () => {
  const queryClient = useQueryClient();

  const createSiteMutation = useMutation({
    mutationFn: async (formData: SiteFormData) => {
      try {
        console.log('Creating site with data:', formData);
        // Convert the form data to the correct format expected by the API
        const apiFormData = convertToModelSiteFormData(formData);
        const result = await sitesApi.createSite(apiFormData);
        return { id: result.id || 'new-site-id' };
      } catch (error: any) {
        console.error('Error creating site:', error);
        throw new Error(error.message || 'Failed to create site');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch sites queries
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error creating site: ${error.message}`);
    }
  });

  return {
    createSite: createSiteMutation.mutateAsync,
    createSiteMutation,
    isCreating: createSiteMutation.isPending,
    error: createSiteMutation.error
  };
};
