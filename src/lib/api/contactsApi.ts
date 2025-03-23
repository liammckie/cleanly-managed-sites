
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../types';

// Contacts API functions
export const contactsApi = {
  // Get all contacts for the current user, optionally filtered by entity type
  async getContacts(entityType?: string): Promise<ContactRecord[]> {
    let query = supabase
      .from('contacts')
      .select('*');
    
    if (entityType && entityType !== 'all') {
      query = query.eq('entity_type', entityType);
    }
    
    const { data: contacts, error } = await query.order('created_at', { ascending: false });
    
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
  
  // Create a new contact
  async createContact(contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ContactRecord> {
    console.log('Creating contact with data:', contactData);
    
    // Check for user but don't throw if not found - let the DB handle permissions
    const { data: { user } } = await supabase.auth.getUser();
    
    // Make sure required fields are present
    if (!contactData.name || !contactData.role) {
      throw new Error('Missing required contact data: name and role are required');
    }
    
    // If entity_id is missing, use a placeholder (can be updated later)
    if (!contactData.entity_id) {
      contactData.entity_id = 'general';
    }
    
    // If entity_type is missing, use a default
    if (!contactData.entity_type) {
      contactData.entity_type = 'internal';
    }
    
    // Prepare the contact data for insertion
    const contactRecord = {
      ...contactData,
      user_id: user?.id, // This will be null if no user, but the RLS policies will handle this
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contactRecord)
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
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
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
    let results: any[] = [];

    // Search clients
    if (!entityType || entityType === 'client') {
      try {
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
      } catch (error) {
        console.error('Error in client search:', error);
      }
    }

    // Search sites
    if (!entityType || entityType === 'site') {
      try {
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
      } catch (error) {
        console.error('Error in site search:', error);
      }
    }

    // Search contractors (as a fallback for suppliers)
    if (!entityType || entityType === 'supplier') {
      try {
        // Check if the contractors table exists and has the required fields
        const { data: contractors, error: contractorError } = await supabase
          .from('contractors')
          .select('id, business_name, abn')
          .ilike('business_name', `%${query}%`)
          .limit(5);

        if (contractorError) {
          console.error('Error searching contractors:', contractorError);
        } else if (contractors && Array.isArray(contractors)) {
          // Process each contractor record, ensuring we have valid data
          const contractorResults = contractors.map(contractor => {
            // Make sure we have all properties before accessing them
            return {
              id: contractor.id,
              name: contractor.business_name,
              // Use ABN as an identifier if available
              identifier: contractor.abn || '',
              type: 'supplier'
            };
          });
          
          results = [...results, ...contractorResults];
        }
      } catch (error) {
        console.error('Error in contractor search:', error);
      }
    }

    return results;
  }
};
