
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteDTO } from '@/types/dto';
import { validateWithZod } from '@/utils/zodValidation';
import { siteFormSchema } from '@/lib/validation/siteSchema';
import { normalizeContractData } from '@/lib/utils/contractDataUtils';

const adaptSiteFormToUpdateData = (formData: SiteFormData): Partial<SiteDTO> => {
  // Convert numerical values to make sure they're consistent with expected types
  const contractDetails = formData.contractDetails || formData.contract_details;
  
  // Create a compatible contract details object if it exists
  const adaptedContractDetails = contractDetails ? normalizeContractData(contractDetails) : undefined;
  
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
    billingLines: formData.billingDetails.billingLines || [],
    // Ensure serviceDeliveryType is a valid enum value
    serviceDeliveryType: (formData.billingDetails.serviceDeliveryType === 'direct' || 
                         formData.billingDetails.serviceDeliveryType === 'contractor') 
                         ? formData.billingDetails.serviceDeliveryType as 'direct' | 'contractor'
                         : 'direct'
  } : undefined;

  return {
    name: formData.name,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postcode: formData.postalCode || formData.postcode, // Use either property
    status: formData.status === 'lost' ? 'inactive' : formData.status,
    contract_details: adaptedContractDetails,
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<SiteDTO> | SiteFormData }) => {
      // If it's form data, validate and adapt it
      if ('postalCode' in data || 'postcode' in data) {
        const validation = validateWithZod(siteFormSchema, data);
        if (!validation.success) {
          throw new Error('Invalid site data: ' + Object.values(validation.errors || {}).join(', '));
        }
        const updateData = adaptSiteFormToUpdateData(data as SiteFormData);
        return await sitesApi.updateSite(id, updateData);
      } 
      // If it's already a DTO, just use it directly but ensure contract_details is properly formatted
      else if (data.contract_details) {
        // Handle renewal period conversion if needed
        const adaptedData = {
          ...data,
          contract_details: normalizeContractData(data.contract_details)
        };
        return await sitesApi.updateSite(id, adaptedData);
      }
      // Otherwise just use it directly
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
