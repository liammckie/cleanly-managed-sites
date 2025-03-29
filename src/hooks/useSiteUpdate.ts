import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

// Import needed to convert types for the database
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
} => {
  const router = useRouter();
  
  const updateSite = async (id: string, siteData: any) => {
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
      router.refresh();
      return data;
    } catch (error: any) {
      console.error('Error updating site:', error);
      toast.error(`Failed to update site: ${error.message}`);
      throw error;
    }
  };

  const updateSiteMutation = useMutation<any, Error, UpdateSiteMutation>({
    mutationFn: ({ id, data }) => updateSite(id, data),
  });

  return { updateSiteMutation };
};
