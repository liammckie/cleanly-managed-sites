import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { mapToDb } from '@/lib/mappers';
import type { Json } from '@/lib/types';
import type { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useSiteCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prepareSiteForDb = (siteData: any) => {
    return {
      ...siteData,
      representative: siteData.representative || '',
      contract_details: siteData.contract_details as Json,
      billing_details: siteData.billing_details as Json
    };
  };

  const createSite = async (siteData: any) => {
    try {
      setIsSubmitting(true);
      
      const dbReadySiteData = prepareSiteForDb(siteData);
      const { data, error } = await supabase
        .from('sites')
        .insert(dbReadySiteData)
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
