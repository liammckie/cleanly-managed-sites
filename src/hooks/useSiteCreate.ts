
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { contractDetailsToDb } from '@/lib/adapters/contractAdapter';
import { ContractDetailsDTO } from '@/components/sites/contract/types';

export const useSiteCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const createSite = async (formData: SiteFormData) => {
    setIsSubmitting(true);
    try {
      // Create payload for database
      const siteData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postalCode,
        status: formData.status,
        client_id: formData.client_id,
        representative: formData.representative,
        phone: formData.phone,
        email: formData.email,
        custom_id: formData.customId,
        // Convert contract details to JSON for database
        contract_details: contractDetailsToDb(formData.contractDetails || formData.contract_details) as any,
        // Convert billing details to JSON for database
        billing_details: {
          billingAddress: formData.billingDetails?.billingAddress,
          serviceDeliveryType: formData.billingDetails?.serviceDeliveryType || 'direct',
          billingLines: formData.billingDetails?.billingLines || [],
          useClientInfo: formData.billingDetails?.useClientInfo,
          billingMethod: formData.billingDetails?.billingMethod,
          paymentTerms: formData.billingDetails?.paymentTerms,
          billingEmail: formData.billingDetails?.billingEmail,
          contacts: formData.billingDetails?.contacts || [],
          ...formData.billingDetails
        }
      };

      // Create site
      const { data, error } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single();

      if (error) {
        console.error('Error creating site:', error);
        throw new Error('Failed to create site');
      }

      toast.success('Site created successfully');
      return data;
    } catch (error) {
      console.error('Error in createSite:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create site');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createSite,
    isSubmitting
  };
};

export default useSiteCreate;
