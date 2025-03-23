
import { supabase } from '@/integrations/supabase/client';

// Entity search utilities
export const searchApi = {
  // Search for entities by name
  async searchEntities(query: string, entityType?: string): Promise<any[]> {
    if (!query || query.length < 2) {
      return [];
    }

    let results: any[] = [];

    try {
      // Search clients
      if (!entityType || entityType === 'client') {
        const { data: clients, error } = await supabase
          .from('clients')
          .select('id, name, custom_id')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (!error && clients) {
          results = [
            ...results,
            ...clients.map(client => ({
              id: client.id,
              name: client.name,
              identifier: client.custom_id,
              type: 'client'
            }))
          ];
        }
      }

      // Search sites
      if (!entityType || entityType === 'site') {
        const { data: sites, error } = await supabase
          .from('sites')
          .select('id, name, client_id, custom_id')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (!error && sites) {
          results = [
            ...results,
            ...sites.map(site => ({
              id: site.id,
              name: site.name,
              identifier: site.custom_id || '',
              type: 'site',
              parent_id: site.client_id
            }))
          ];
        }
      }

      // Search suppliers
      if (!entityType || entityType === 'supplier') {
        const { data: suppliers, error } = await supabase
          .from('contractors')
          .select('id, business_name, abn')
          .ilike('business_name', `%${query}%`)
          .limit(5);

        if (!error && suppliers && Array.isArray(suppliers)) {
          results = [
            ...results,
            ...suppliers.map(supplier => ({
              id: supplier.id,
              name: supplier.business_name,
              identifier: supplier.abn || '',
              type: 'supplier'
            }))
          ];
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching entities:', error);
      return [];
    }
  }
};
