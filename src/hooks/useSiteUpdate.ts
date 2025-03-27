
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteDTO } from '@/types/dto';
import { validateWithZod } from '@/lib/validation';
import { siteFormSchema } from '@/lib/validation/siteSchema';

// Adapt site data for API submission
const adaptSiteFormToApiData = (formData: SiteFormData): Partial<SiteDTO> => {
  // Convert contractDetails to the appropriate format
  const contractDetails = formData.contractDetails || formData.contract_details;
  
  // Create a compatible contract details object if it exists
  const adaptedContractDetails = contractDetails ? {
    ...contractDetails,
    renewalPeriod: contractDetails.renewalPeriod?.toString() || '',
  } : undefined;
  
  // Create a compatible billingAddress object if it exists
  const billingAddress = formData.billingDetails?.billingAddress ? {
    street: formData.billingDetails.billingAddress.street || '',
    city: formData.billingDetails.billingAddress.city || '',
    state: formData.billingDetails.billingAddress.state || '',
    postcode: formData.billingDetails.billingAddress.postcode || '',
    country: formData.billingDetails.billingAddress.country || 'Australia'
  } : undefined;
  
  // Create a compatible billing details object
  const adaptedBillingDetails = formData.billingDetails ? {
    ...formData.billingDetails,
    billingAddress,
    serviceDeliveryType: formData.billingDetails.serviceDeliveryType === 'contractor' ? 'contractor' : 'direct',
    billingLines: formData.billingDetails.billingLines || []
  } : undefined;
  
  return {
    name: formData.name,
    client_id: formData.client_id || formData.clientId, // Use either property
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postcode: formData.postalCode || formData.postcode, // Use either property
    status: formData.status === 'lost' ? 'inactive' : formData.status,
    
    // Convert contract details to match DTO
    contract_details: adaptedContractDetails,
    
    // Convert billing details to match DTO
    billing_details: adaptedBillingDetails,
    
    email: formData.email,
    phone: formData.phone,
    representative: formData.representative,
    custom_id: formData.customId,
    notes: formData.notes
  };
};

export function useSiteUpdate() {
  const queryClient = useQueryClient();

  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SiteFormData }) => {
      // Validate the site data before sending to API
      const validation = validateWithZod(siteFormSchema, data);
      if (!validation.success) {
        throw new Error('Invalid site data: ' + Object.values(validation.errors || {}).join(', '));
      }
      
      const adaptedData = adaptSiteFormToApiData(data);
      return await sitesApi.updateSite(id, adaptedData as any);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    }
  });

  return {
    updateSite: updateSiteMutation.mutate,
    isUpdating: updateSiteMutation.isPending,
    error: updateSiteMutation.error,
  };
}
