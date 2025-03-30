
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { adaptSiteFormToDb, prepareSiteForDb } from '@/lib/types/adapters/siteAdapter';

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
      // Use the adapter to prepare the site data for the database
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
      return data;
    } catch (error: any) {
      console.error('Error updating site:', error);
      toast.error(`Failed to update site: ${error.message}`);
      throw error;
    }
  };

  const updateSiteMutation = useMutation({
    mutationFn: (params) => updateSite(params),
  });

  return { 
    updateSiteMutation,
    updateSite
  };
};
