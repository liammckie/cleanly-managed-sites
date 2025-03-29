
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

interface UpdateSiteParams {
  id: string;
  data: SiteFormData;
}

export function useSiteUpdate(id?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSite = async (params: UpdateSiteParams) => {
    const siteId = id || params.id;
    if (!siteId) {
      throw new Error("Site ID is required for updates");
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const formData = params.data;
      
      const updateData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postalCode || formData.postcode,
        country: formData.country,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
        contract_details: formData.contract_details || {},
        billing_details: formData.billingDetails || {},
        // Additional fields as needed
      };
      
      const { data, error: updateError } = await supabase
        .from('sites')
        .update(updateData)
        .eq('id', siteId)
        .select()
        .single();
        
      if (updateError) throw new Error(updateError.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during site update';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSiteMutation = {
    mutateAsync: updateSite,
    isLoading,
    error
  };

  return { updateSite, updateSiteMutation };
}
