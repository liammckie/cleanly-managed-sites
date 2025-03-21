
import { supabase } from '@/integrations/supabase/client';
import { ClientRecord, SiteRecord } from '../types';

// Client API functions
export const clientsApi = {
  // Get all clients for the current user
  async getClients(): Promise<ClientRecord[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return clients as ClientRecord[] || [];
  },
  
  // Get a single client by ID
  async getClientById(id: string): Promise<ClientRecord | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      throw error;
    }
    
    return data as ClientRecord;
  },
  
  // Create a new client
  async createClient(clientData: Partial<ClientRecord>): Promise<ClientRecord> {
    console.log('Creating client with data:', clientData);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Make sure required fields are present
    if (!clientData.name || !clientData.contact_name || !clientData.status) {
      throw new Error('Missing required client data: name, contact_name, and status are required');
    }
    
    // Prepare the client data for insertion
    const clientRecord = {
      name: clientData.name,
      contact_name: clientData.contact_name,
      email: clientData.email || null,
      phone: clientData.phone || null,
      address: clientData.address || null,
      city: clientData.city || null,
      state: clientData.state || null,
      postcode: clientData.postcode || null,
      status: clientData.status as string, // Cast to string to match Supabase expectations
      notes: clientData.notes || null,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert(clientRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    
    return data as ClientRecord;
  },
  
  // Update an existing client
  async updateClient(id: string, clientData: Partial<ClientRecord>): Promise<ClientRecord> {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }
    
    return data as ClientRecord;
  },
  
  // Delete a client
  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get sites for a client
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
  }
};
