
import { supabase } from '@/integrations/supabase/client';

export const clientStatsApi = {
  async getClientCountByStatus(): Promise<Record<string, number>> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('status');
    
    if (error) {
      console.error('Error fetching client status counts:', error);
      throw error;
    }
    
    // Initialize status count with zeros for all expected statuses
    const statusCount: Record<string, number> = {
      active: 0,
      inactive: 0,
      pending: 0
    };
    
    // Only count clients with valid status values that match our expected statuses
    clients?.forEach(client => {
      const status = client.status?.toLowerCase();
      if (status && status in statusCount) {
        statusCount[status] += 1;
      }
    });
    
    return statusCount;
  },
  
  async getClientsTotalCount(): Promise<number> {
    const { count, error } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting clients:', error);
      throw error;
    }
    
    return count || 0;
  }
};
