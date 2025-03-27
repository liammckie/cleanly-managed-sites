
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteDTO } from '@/types/dto';
import { validateWithZod } from '@/lib/validation';
import { siteFormSchema } from '@/lib/validation/siteSchema';

const adaptSiteFormToUpdateData = (formData: SiteFormData): Partial<SiteDTO> => {
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<SiteDTO> | SiteFormData }) => {
      // If it's form data, validate and adapt it
      if ('postalCode' in data) {
        const validation = validateWithZod(siteFormSchema, data);
        if (!validation.success) {
          throw new Error('Invalid site data: ' + Object.values(validation.errors || {}).join(', '));
        }
        const updateData = adaptSiteFormToUpdateData(data as SiteFormData);
        return await sitesApi.updateSite(id, updateData);
      } 
      // If it's already a DTO, just use it directly
      else {
        return await sitesApi.updateSite(id, data);
      }
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
