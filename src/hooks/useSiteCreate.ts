
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { mapToDb } from '@/lib/mappers';
import type { Json } from '@/types/common';
import type { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useSiteCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSite = async (formData: SiteFormData) => {
    try {
      setIsSubmitting(true);
      
      const siteData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state, 
        postcode: formData.postalCode || formData.postcode,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        custom_id: formData.customId,
        client_id: formData.client_id,
        contract_details: formData.contract_details || {},
        billing_details: formData.billingDetails || {},
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
      
      const { data, error } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      toast.success('Site created successfully');
      return data;
    } catch (error: any) {
      toast.error(`Failed to create site: ${error.message}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createSite, isSubmitting };
}
