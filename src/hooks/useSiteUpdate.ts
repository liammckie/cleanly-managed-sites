import { useMutation } from '@tanstack/react-query';
import { sitesApi } from '@/lib/api/sites';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteRecord } from '@/lib/types';
import { toast } from 'sonner';

export function useSiteUpdate() {
  // Create the mutation
  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SiteFormData }) => {
      // Handle billing details type casting to ensure serviceDeliveryType is "direct" or "contractor"
      if (data.billingDetails?.serviceDeliveryType) {
        data.billingDetails.serviceDeliveryType = 
          data.billingDetails.serviceDeliveryType === 'contractor' ? 'contractor' : 'direct';
      }
      
      return await sitesApi.updateSite(id, data);
    },
    onSuccess: () => {
      toast.success('Site updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating site: ${error.message}`);
    }
  });

  return {
    updateSite: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
    updateSiteMutation: mutation  // Add this property for compatibility
  };
}
