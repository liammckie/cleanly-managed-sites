import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteDTO } from '@/types/dto';

// Adapt site data for API submission
const adaptSiteFormToApiData = (formData: SiteFormData): Partial<SiteDTO> => {
  return {
    name: formData.name,
    client_id: formData.clientId,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postcode: formData.postalCode,
    status: formData.status === 'lost' ? 'inactive' : formData.status,
    contract_details: formData.contractDetails,
    billing_details: formData.billingDetails,
    // other fields...
  };
};

export function useSiteCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createSiteMutation = useMutation({
    mutationFn: async (siteData: SiteFormData) => {
      const adaptedData = adaptSiteFormToApiData(siteData);
      return await sitesApi.createSite(adaptedData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully!');
      navigate(`/sites/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to create site: ${error.message}`);
    },
  });

  return {
    createSite: createSiteMutation.mutate,
    isCreating: createSiteMutation.isPending,
    error: createSiteMutation.error,
  };
}
