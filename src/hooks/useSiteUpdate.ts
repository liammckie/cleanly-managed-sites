
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { Json } from '@/lib/types';

// Function to prepare site data for database update
const prepareSiteForDb = (siteData: any) => {
  return {
    ...siteData,
    contract_details: siteData.contract_details as Json,
    billing_details: siteData.billing_details as Json
  };
};

interface UpdateSiteMutation {
  id: string;
  data: SiteFormData;
}

export const useSiteUpdate = (): {
  updateSiteMutation: UseMutationResult<any, Error, UpdateSiteMutation>;
  updateSite: (params: UpdateSiteMutation) => Promise<any>;
} => {
  const navigate = useNavigate();
  
  const updateSite = async (params: UpdateSiteMutation) => {
    const { id, data: siteData } = params;
    try {
      const dbReadySiteData = prepareSiteForDb(siteData);
      const { data, error } = await supabase
        .from('sites')
        .update(dbReadySiteData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating site:', error);
        throw new Error(error.message);
      }
      
      toast.success('Site updated successfully!');
      // Instead of router.refresh(), we can either navigate to the same page or just return the data
      return data;
    } catch (error: any) {
      console.error('Error updating site:', error);
      toast.error(`Failed to update site: ${error.message}`);
      throw error;
    }
  };

  const updateSiteMutation = useMutation<any, Error, UpdateSiteMutation>({
    mutationFn: (params) => updateSite(params),
  });

  return { 
    updateSiteMutation,
    updateSite
  };
};
