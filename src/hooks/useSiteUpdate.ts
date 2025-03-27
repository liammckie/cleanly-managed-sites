
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteRecord } from '@/lib/types';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { convertToModelSiteFormData } from '@/utils/siteFormAdapters';

export const useSiteUpdate = () => {
  const queryClient = useQueryClient();

  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SiteRecord> }) => {
      try {
        console.log('Updating site:', id, data);
        return await sitesApi.updateSite(id, data);
      } catch (error: any) {
        console.error('Error updating site:', error);
        throw new Error(error.message || 'Failed to update site');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: Error) => {
      toast.error(`Error updating site: ${error.message}`);
    }
  });

  const updateSite = async (siteId: string, formData: SiteFormData) => {
    const modelData = convertToModelSiteFormData(formData);
    return await updateSiteMutation.mutateAsync({ id: siteId, data: modelData });
  };

  return {
    updateSite,
    updateSiteMutation,
    isLoading: updateSiteMutation.isPending
  };
};
