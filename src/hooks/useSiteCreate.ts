
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useSiteCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const createSite = async (formData: SiteFormData) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare the site data for insertion
      const siteData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        status: formData.status,
        client_id: formData.client_id,
        representative: formData.representative,
        phone: formData.phone,
        email: formData.email,
        custom_id: formData.custom_id,
        contract_details: formData.contractDetails,
        billing_details: formData.billingDetails,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating site: ${error.message}`);
      }

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
