
import { supabase } from '@/integrations/supabase/client';
import { ContactEntity } from './types';

// Search for entities to link contacts to (cross-system linking)
export async function searchEntities(query: string, entityType?: string): Promise<ContactEntity[]> {
  // Default empty array for results
  let results: ContactEntity[] = [];

  if (!query || query.length < 2) {
    return results;
  }

  try {
    // Search clients
    if (!entityType || entityType === 'client') {
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id, name, custom_id')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (clientError) {
        console.error('Error searching clients:', clientError);
      } else if (clients) {
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
      const { data: sites, error: siteError } = await supabase
        .from('sites')
        .select('id, name, client_id, custom_id')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (siteError) {
        console.error('Error searching sites:', siteError);
      } else if (sites) {
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

    // Search contractors (for suppliers)
    if (!entityType || entityType === 'supplier') {
      try {
        const { data: contractors, error: contractorError } = await supabase
          .from('contractors')
          .select('id, business_name, abn')
          .ilike('business_name', `%${query}%`)
          .limit(5);

        if (contractorError) {
          console.error('Error searching contractors:', contractorError);
        } else if (contractors && Array.isArray(contractors)) {
          const contractorResults = contractors.map(contractor => ({
            id: contractor.id,
            name: contractor.business_name,
            identifier: contractor.abn || '',
            type: 'supplier'
          }));
          
          results = [...results, ...contractorResults];
        }
      } catch (error) {
        console.error('Error in contractor search:', error);
      }
    }

    return results;
  } catch (error) {
    console.error('Error in searchEntities:', error);
    return [];
  }
}
