
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { prepareSiteForDb } from '@/lib/types/adapters/siteAdapter';
import type { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useSiteCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSite = async (siteData: SiteFormData) => {
    try {
      setIsSubmitting(true);
      
      // Use the adapter to prepare the site data for the database
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
