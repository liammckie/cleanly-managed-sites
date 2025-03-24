
import { supabase } from '@/integrations/supabase/client';
import { SiteRecord } from '../../types';

export const clientSitesApi = {
  async getClientSites(clientId: string): Promise<SiteRecord[]> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('client_id', clientId)
      .order('name');
    
    if (error) {
      console.error(`Error fetching sites for client ${clientId}:`, error);
      throw error;
    }
    
    return data as SiteRecord[] || [];
  },
  
  async getClientSitesByStatus(clientId: string, status: string): Promise<SiteRecord[]> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', status)
      .order('name');
    
    if (error) {
      console.error(`Error fetching ${status} sites for client ${clientId}:`, error);
      throw error;
    }
    
    return data as SiteRecord[] || [];
  }
};
