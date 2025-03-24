
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../types';
import { ContactFilters } from '@/hooks/useContacts';

// Contacts API functions
export const contactsApi = {
  // Get all contacts for the current user, optionally filtered by entity type
  async getContacts(filters: ContactFilters = {}): Promise<ContactRecord[]> {
    let query = supabase
      .from('contacts')
      .select('*');
    
    // Apply entity type filter
    if (filters.entityType && filters.entityType !== 'all') {
      query = query.eq('entity_type', filters.entityType);
    }
    
    // Apply entity ID filter
    if (filters.entityId) {
      query = query.eq('entity_id', filters.entityId);
    }
    
    // Apply search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm},role.ilike.${searchTerm},department.ilike.${searchTerm},phone.ilike.${searchTerm}`);
    }
    
    // Apply role filter
    if (filters.role && filters.role.trim() !== '') {
      query = query.ilike('role', `%${filters.role}%`);
    }
    
    // Apply department filter
    if (filters.department && filters.department.trim() !== '') {
      query = query.ilike('department', `%${filters.department}%`);
    }
    
    // Apply primary contact filter
    if (filters.isPrimary !== undefined) {
      query = query.eq('is_primary', filters.isPrimary);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const direction = filters.sortDirection || 'asc';
      query = query.order(filters.sortBy, { ascending: direction === 'asc' });
    } else {
      // Default sorting by created_at
      query = query.order('created_at', { ascending: false });
    }
    
    const { data: contacts, error } = await query;
    
    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
    
    return contacts as ContactRecord[] || [];
  },
  
  // Get a single contact by ID
  async getContactById(id: string): Promise<ContactRecord | null> {
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
  },

  // Get all entities that have contacts
  async getContactEntities(): Promise<Array<{id: string, name: string, type: string}>> {
    let entities: Array<{id: string, name: string, type: string}> = [];
    
    // Fetch clients with contacts
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', supabase.from('contacts').select('entity_id').eq('entity_type', 'client'));
    
    if (clientError) {
      console.error('Error fetching client entities:', clientError);
    } else if (clients) {
      entities = [
        ...entities,
        ...clients.map(client => ({
          id: client.id,
          name: client.name,
          type: 'client'
        }))
      ];
    }
    
    // Fetch sites with contacts
    const { data: sites, error: siteError } = await supabase
      .from('sites')
      .select('id, name')
      .in('id', supabase.from('contacts').select('entity_id').eq('entity_type', 'site'));
    
    if (siteError) {
      console.error('Error fetching site entities:', siteError);
    } else if (sites) {
      entities = [
        ...entities,
        ...sites.map(site => ({
          id: site.id,
          name: site.name,
          type: 'site'
        }))
      ];
    }
    
    // Fetch suppliers (contractors) with contacts
    const { data: contractors, error: contractorError } = await supabase
      .from('contractors')
      .select('id, business_name')
      .in('id', supabase.from('contacts').select('entity_id').eq('entity_type', 'supplier'));
    
    if (contractorError) {
      console.error('Error fetching supplier entities:', contractorError);
    } else if (contractors) {
      entities = [
        ...entities,
        ...contractors.map(contractor => ({
          id: contractor.id,
          name: contractor.business_name,
          type: 'supplier'
        }))
      ];
    }
    
    return entities;
  },
  
  // Create a new contact
  async createContact(contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ContactRecord> {
    console.log('Creating contact with data:', contactData);
    
    // Check for user but don't throw if not found - let the DB handle permissions
    const { data: { user } } = await supabase.auth.getUser();
    
    // Make sure required fields are present
    if (!contactData.name || !contactData.role) {
      throw new Error('Missing required contact data: name and role are required');
    }
    
    // Prepare services field as JSON
    const preparedContactData = {
      ...contactData,
      // If entity_id is missing or empty, use null
      entity_id: contactData.entity_id && contactData.entity_id.trim() !== '' ? contactData.entity_id : null,
      user_id: user?.id, // This will be null if no user, but the RLS policies will handle this
      services: contactData.services || null,
      monthly_cost: contactData.monthly_cost || null,
      is_flat_rate: contactData.is_flat_rate !== undefined ? contactData.is_flat_rate : true
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(preparedContactData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  // Update an existing contact
  async updateContact(id: string, contactData: Partial<ContactRecord>): Promise<ContactRecord> {
    // Ensure services is properly handled
    const preparedData = {
      ...contactData,
      services: contactData.services || null,
      monthly_cost: contactData.monthly_cost || null,
      is_flat_rate: contactData.is_flat_rate !== undefined ? contactData.is_flat_rate : true
    };

    const { data, error } = await supabase
      .from('contacts')
      .update(preparedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  // Delete a contact
  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get contacts for a specific entity (client, site, etc.)
  async getContactsByEntityId(entityId: string, entityType: string): Promise<ContactRecord[]> {
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
  },
  
  // Set a contact as primary for its entity
  async setPrimaryContact(id: string, entityId: string, entityType: string): Promise<void> {
    // Start a transaction by first unsetting current primary
    const { error: updateError } = await supabase
      .from('contacts')
      .update({ is_primary: false })
      .eq('entity_id', entityId)
      .eq('entity_type', entityType);
    
    if (updateError) {
      console.error('Error unsetting primary contacts:', updateError);
      throw updateError;
    }
    
    // Then set the new primary
    const { error: setPrimaryError } = await supabase
      .from('contacts')
      .update({ is_primary: true })
      .eq('id', id);
    
    if (setPrimaryError) {
      console.error(`Error setting contact ${id} as primary:`, setPrimaryError);
      throw setPrimaryError;
    }
  },

  // Search for entities to link contacts to (cross-system linking)
  async searchEntities(query: string, entityType?: string): Promise<any[]> {
    // Default empty array for results
    let results: any[] = [];

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
};
