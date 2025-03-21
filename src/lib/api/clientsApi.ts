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
  
  // Get client count by status
  async getClientCountByStatus(): Promise<Record<string, number>> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('status');
    
    if (error) {
      console.error('Error fetching client status counts:', error);
      throw error;
    }
    
    const statusCount: Record<string, number> = {
      active: 0,
      inactive: 0,
      pending: 0
    };
    
    clients?.forEach(client => {
      if (client.status in statusCount) {
        statusCount[client.status] += 1;
      }
    });
    
    return statusCount;
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
  async createClient(clientData: Partial<ClientRecord> & { custom_id?: string }): Promise<ClientRecord> {
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
      // If custom_id exists and is not empty, use it
      ...(clientData.custom_id && clientData.custom_id.trim() !== '' ? { custom_id: clientData.custom_id } : {})
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
  async updateClient({ id, data }: { id: string; data: Partial<ClientRecord> & { custom_id?: string } }): Promise<ClientRecord> {
    // Create update object
    const updateData = {
      ...data,
      // Only include custom_id if it exists and isn't empty
      ...(data.custom_id !== undefined ? 
        (data.custom_id.trim() !== '' ? { custom_id: data.custom_id } : { custom_id: null }) 
        : {})
    };
    
    const { data: responseData, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }
    
    return responseData as ClientRecord;
  },
  
  // Delete a client
  async deleteClient(id: string): Promise<void> {
    // First, check if the client has any sites
    const { data: sites } = await supabase
      .from('sites')
      .select('id')
      .eq('client_id', id);
    
    if (sites && sites.length > 0) {
      // Delete all sites associated with this client
      for (const site of sites) {
        // Delete any subcontractors for each site
        await supabase
          .from('subcontractors')
          .delete()
          .eq('site_id', site.id);
      }
      
      // Delete all sites
      await supabase
        .from('sites')
        .delete()
        .eq('client_id', id);
    }
    
    // Now delete the client
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
  },
  
  // Get total count of clients
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
