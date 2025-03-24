
import { useCallback } from 'react';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { useQueryClient } from '@tanstack/react-query';

export function useSiteOperations() {
  const queryClient = useQueryClient();
  
  const createSite = useCallback(async (siteData: SiteFormData) => {
    try {
      const result = await sitesApi.createSite(siteData);
      toast.success('Site created successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      return result;
    } catch (error: any) {
      console.error('Error creating site:', error);
      toast.error(`Failed to create site: ${error.message}`);
      throw error;
    }
  }, [queryClient]);
  
  const updateSite = useCallback(async (siteId: string, siteData: Partial<SiteFormData>) => {
    try {
      const result = await sitesApi.updateSite(siteId, siteData);
      toast.success('Site updated successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', siteId] });
      return result;
    } catch (error: any) {
      console.error('Error updating site:', error);
      toast.error(`Failed to update site: ${error.message}`);
      throw error;
    }
  }, [queryClient]);
  
  const deleteSite = useCallback(async (siteId: string) => {
    try {
      await sitesApi.deleteSite(siteId);
      toast.success('Site deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      return true;
    } catch (error: any) {
      console.error('Error deleting site:', error);
      toast.error(`Failed to delete site: ${error.message}`);
      throw error;
    }
  }, [queryClient]);
  
  return {
    createSite,
    updateSite,
    deleteSite
  };
}
