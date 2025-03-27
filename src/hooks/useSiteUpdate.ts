import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SiteRecord } from '@/types/models';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

const adaptSiteFormToUpdateData = (formData: SiteFormData): Partial<SiteRecord> => {
  return {
    name: formData.name,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postcode: formData.postalCode,
    status: formData.status === 'lost' ? 'inactive' : formData.status,
    contract_details: formData.contractDetails,
    billing_details: formData.billingDetails,
  };
};

export function useSiteUpdate() {
  const queryClient = useQueryClient();

  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SiteRecord> | SiteFormData }) => {
      const updateData = 'postalCode' in data ? adaptSiteFormToUpdateData(data as SiteFormData) : data;
      return await sitesApi.updateSite(id, updateData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
      toast.success('Site updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update site: ${error.message}`);
    },
  });

  return {
    updateSiteMutation,
    isUpdating: updateSiteMutation.isPending,
    error: updateSiteMutation.error,
  };
}
