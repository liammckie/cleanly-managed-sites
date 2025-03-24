
import { supabase } from '@/integrations/supabase/client';
import { ClientRecord } from '../../types';

export const clientCoreApi = {
  async getClients(): Promise<ClientRecord[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    const clientIds = clients.map(client => client.id);
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .in('entity_id', clientIds)
      .eq('entity_type', 'client');
    
    if (contactsError) {
      console.error('Error fetching client contacts:', contactsError);
      throw contactsError;
    }
    
    const clientsWithContacts = clients.map(client => ({
      ...client,
      contacts: contacts.filter(contact => contact.entity_id === client.id)
    }));
    
    return clientsWithContacts as ClientRecord[] || [];
  },
  
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
    
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', id)
      .eq('entity_type', 'client');
    
    if (contactsError) {
      console.error(`Error fetching contacts for client ${id}:`, contactsError);
      throw contactsError;
    }
    
    const clientWithContacts = {
      ...data,
      contacts: contacts
    };
    
    return clientWithContacts as ClientRecord;
  },
  
  async createClient(clientData: Partial<ClientRecord> & { custom_id?: string }): Promise<ClientRecord> {
    console.log('Creating client with data:', clientData);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    if (!clientData.name || !clientData.contact_name || !clientData.status) {
      throw new Error('Missing required client data: name, contact_name, and status are required');
    }
    
    const clientRecord = {
      name: clientData.name,
      contact_name: clientData.contact_name,
      email: clientData.email || null,
      phone: clientData.phone || null,
      address: clientData.address || null,
      city: clientData.city || null,
      state: clientData.state || null,
      postcode: clientData.postcode || null,
      status: clientData.status as string,
      notes: clientData.notes || null,
      user_id: user.id,
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
  
  async updateClient({ id, data }: { id: string; data: Partial<ClientRecord> & { custom_id?: string } }): Promise<ClientRecord> {
    const updateData = {
      ...data,
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
  
  async deleteClient(id: string): Promise<void> {
    const { data: sites } = await supabase
      .from('sites')
      .select('id')
      .eq('client_id', id);
    
    if (sites && sites.length > 0) {
      for (const site of sites) {
        await supabase
          .from('subcontractors')
          .delete()
          .eq('site_id', site.id);
      }
      
      await supabase
        .from('sites')
        .delete()
        .eq('client_id', id);
    }
    
    await supabase
      .from('contacts')
      .delete()
      .eq('entity_id', id)
      .eq('entity_type', 'client');
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw error;
    }
  },
  
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
  
  async getClientsTotalCount(): Promise<number> {
    const { count, error } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting clients:', error);
      throw error;
    }
    
    return count || 0;
  },
};
