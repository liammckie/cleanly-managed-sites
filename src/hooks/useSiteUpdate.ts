
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteDTO } from '@/types/dto';
import { validateWithZod } from '@/lib/validation';
import { siteFormSchema } from '@/lib/validation/siteSchema';

const adaptSiteFormToUpdateData = (formData: SiteFormData): Partial<SiteDTO> => {
  // Convert numerical values to make sure they're consistent with expected types
  const renewalPeriod = formData.contractDetails?.renewalPeriod 
    ? String(formData.contractDetails.renewalPeriod) 
    : undefined;
  
  // Create a compatible billingAddress object if it exists
  const billingAddress = formData.billingDetails?.billingAddress ? {
    street: formData.billingDetails.billingAddress.street || '',
    city: formData.billingDetails.billingAddress.city || '',
    state: formData.billingDetails.billingAddress.state || '',
    postcode: formData.billingDetails.billingAddress.postcode || '',
    country: formData.billingDetails.billingAddress.country || 'Australia'
  } : undefined;

  return {
    name: formData.name,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postcode: formData.postalCode || formData.postcode, // Use either property
    status: formData.status === 'lost' ? 'inactive' : formData.status,
    contract_details: formData.contractDetails 
      ? {
          ...formData.contractDetails,
          renewalPeriod
        }
      : formData.contract_details,
    billing_details: formData.billingDetails
      ? {
          ...formData.billingDetails,
          billingAddress,
          // Make sure billingLines exists
          billingLines: formData.billingDetails.billingLines || []
        }
      : undefined,
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
        return await sitesApi.updateSite(id, updateData as any);
      } 
      // If it's already a DTO, just use it directly
      else {
        return await sitesApi.updateSite(id, data as Partial<SiteDTO>);
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
