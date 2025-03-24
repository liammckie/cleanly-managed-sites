
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../../types';
import { ContactFilters } from './types';
import { applyContactFilters } from './contactsCore';

// Get all contacts for the current user, optionally filtered
export async function getContacts(filters: ContactFilters = {}): Promise<ContactRecord[]> {
  let query = supabase.from('contacts').select('*');
  
  // Apply basic filters (entity type, entity ID, role, department, etc.)
  query = applyContactFilters(query, filters);
  
  // Apply search filter if provided
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = `%${filters.search.toLowerCase()}%`;
    
    // First, get a list of site and client IDs that match the search term
    const { data: clientMatches } = await supabase
      .from('clients')
      .select('id')
      .ilike('name', searchTerm);
    
    const { data: siteMatches } = await supabase
      .from('sites')
      .select('id')
      .ilike('name', searchTerm);
    
    const { data: supplierMatches } = await supabase
      .from('contractors')
      .select('id')
      .ilike('business_name', searchTerm);
    
    // Compile all matching entity IDs
    const matchingEntityIds = [
      ...(clientMatches || []).map(c => c.id),
      ...(siteMatches || []).map(s => s.id),
      ...(supplierMatches || []).map(s => s.id)
    ];
    
    // Create a complex OR filter to search in contacts or related entities
    if (matchingEntityIds.length > 0) {
      query = query.or(
        `name.ilike.${searchTerm},email.ilike.${searchTerm},role.ilike.${searchTerm},department.ilike.${searchTerm},phone.ilike.${searchTerm},entity_id.in.(${matchingEntityIds.join(',')})`
      );
    } else {
      // No matching entities, just search in contact fields
      query = query.or(
        `name.ilike.${searchTerm},email.ilike.${searchTerm},role.ilike.${searchTerm},department.ilike.${searchTerm},phone.ilike.${searchTerm}`
      );
    }
  }
  
  const { data: contacts, error } = await query;
  
  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
  
  return contacts as ContactRecord[] || [];
}

// Get a single contact by ID
export async function getContactById(id: string): Promise<ContactRecord | null> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching contact with ID ${id}:`, error);
    throw error;
  }
  
  return data as ContactRecord;
}

// Get all entities that have contacts
export async function getContactEntities(): Promise<Array<{id: string, name: string, type: string}>> {
  let entities: Array<{id: string, name: string, type: string}> = [];
  
  // Add special entries for "all sites" and "all clients"
  entities.push({
    id: 'all_sites',
    name: 'All Sites',
    type: 'site'
  });
  
  entities.push({
    id: 'all_clients',
    name: 'All Clients',
    type: 'client'
  });
  
  // Fetch client contact entities
  try {
    const { data: clientContactIds } = await supabase
      .from('contacts')
      .select('entity_id')
      .eq('entity_type', 'client')
      .not('entity_id', 'in', ['all_sites', 'all_clients']);
    
    if (clientContactIds && clientContactIds.length > 0) {
      const clientIds = clientContactIds.map(row => row.entity_id).filter(Boolean);
      if (clientIds.length > 0) {
        const { data: clients } = await supabase
          .from('clients')
          .select('id, name')
          .in('id', clientIds);
        
        if (clients) {
          entities = [
            ...entities,
            ...clients.map(client => ({
              id: client.id,
              name: client.name,
              type: 'client'
            }))
          ];
        }
      }
    }
  } catch (error) {
    console.error('Error fetching client entities:', error);
  }
  
  // Fetch site contact entities
  try {
    const { data: siteContactIds } = await supabase
      .from('contacts')
      .select('entity_id')
      .eq('entity_type', 'site')
      .not('entity_id', 'in', ['all_sites', 'all_clients']);
    
    if (siteContactIds && siteContactIds.length > 0) {
      const siteIds = siteContactIds.map(row => row.entity_id).filter(Boolean);
      if (siteIds.length > 0) {
        const { data: sites } = await supabase
          .from('sites')
          .select('id, name')
          .in('id', siteIds);
        
        if (sites) {
          entities = [
            ...entities,
            ...sites.map(site => ({
              id: site.id,
              name: site.name,
              type: 'site'
            }))
          ];
        }
      }
    }
  } catch (error) {
    console.error('Error fetching site entities:', error);
  }
  
  // Fetch supplier contact entities
  try {
    const { data: supplierContactIds } = await supabase
      .from('contacts')
      .select('entity_id')
      .eq('entity_type', 'supplier')
      .not('entity_id', 'in', ['all_sites', 'all_clients']);
    
    if (supplierContactIds && supplierContactIds.length > 0) {
      const supplierIds = supplierContactIds.map(row => row.entity_id).filter(Boolean);
      if (supplierIds.length > 0) {
        const { data: contractors } = await supabase
          .from('contractors')
          .select('id, business_name')
          .in('id', supplierIds);
        
        if (contractors && Array.isArray(contractors)) {
          const contractorResults = contractors.map(contractor => ({
            id: contractor.id,
            name: contractor.business_name,
            type: 'supplier'
          }));
          
          entities = [...entities, ...contractorResults];
        }
      }
    }
  } catch (error) {
    console.error('Error fetching supplier entities:', error);
  }
  
  return entities;
}

// Get contacts for a specific entity (client, site, etc.)
export async function getContactsByEntityId(entityId: string, entityType: string): Promise<ContactRecord[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('entity_id', entityId)
    .eq('entity_type', entityType)
    .order('is_primary', { ascending: false });
  
  if (error) {
    console.error(`Error fetching contacts for entity ${entityId}:`, error);
    throw error;
  }
  
  return data as ContactRecord[] || [];
}
