
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteDTO } from '@/types/dto';
import { validateWithZod } from '@/lib/validation';
import { siteFormSchema } from '@/lib/validation/siteSchema';
import { contractDetailsToDb } from '@/lib/api/contracts/contractAdapter';

// Adapt site data for API submission
const adaptSiteFormToApiData = (formData: SiteFormData): Partial<SiteDTO> => {
  // Convert contractDetails to the appropriate format
  const contractDetails = formData.contractDetails || formData.contract_details;
  
  // Convert contract details to DB format
  const adaptedContractDetails = contractDetails ? contractDetailsToDb(contractDetails) : undefined;
  
  // Create a compatible billingAddress object if it exists
  const billingAddress = formData.billingDetails?.billingAddress ? {
    street: formData.billingDetails.billingAddress.street || '',
    city: formData.billingDetails.billingAddress.city || '',
    state: formData.billingDetails.billingAddress.state || '',
    postcode: formData.billingDetails.billingAddress.postcode || '',
    country: formData.billingDetails.billingAddress.country || 'Australia'
  } : undefined;
  
  // Ensure serviceDeliveryType is properly typed
  const serviceDeliveryType = formData.billingDetails?.serviceDeliveryType === 'contractor' 
    ? 'contractor' 
    : 'direct';
  
  // Create a compatible billing details object
  const adaptedBillingDetails = formData.billingDetails ? {
    ...formData.billingDetails,
    billingAddress,
    serviceDeliveryType,
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

export function useSiteCreate() {
  const queryClient = useQueryClient();

  const createSiteMutation = useMutation({
    mutationFn: async (siteData: SiteFormData) => {
      // Validate the site data before sending to API
      const validation = validateWithZod(siteFormSchema, siteData);
      if (!validation.success) {
        throw new Error('Invalid site data: ' + Object.values(validation.errors || {}).join(', '));
      }
      
      const adaptedData = adaptSiteFormToApiData(siteData);
      return await sitesApi.createSite(adaptedData as any);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create site: ' + error.message);
    }
  });

  return {
    createSite: createSiteMutation.mutate,
    isCreating: createSiteMutation.isPending,
    error: createSiteMutation.error,
  };
}
