
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { UnifiedSubcontractor } from '@/lib/utils/typeAdapters';

// Extended DB schema including optional fields we need
interface DbSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description: string;
  frequency: string;
  cost: number;
  created_at: string;
  updated_at: string;
  email?: string;
  phone?: string;
  service?: string;
  services?: string[];
  notes?: string;
}

export const quoteSubcontractorsApi = {
  async fetchSubcontractors(quoteId: string): Promise<UnifiedSubcontractor[]> {
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .select('*')
      .eq('quote_id', quoteId);
    
    if (error) {
      console.error('Error fetching subcontractors:', error);
      throw error;
    }
    
    return (data || []).map((item: any) => ({
      id: item.id,
      quoteId: item.quote_id,
      name: item.name,
      description: item.description || '',
      cost: item.cost || 0,
      frequency: item.frequency || 'monthly',
      email: item.email || '',
      phone: item.phone || '',
      service: item.service || '',
      notes: item.notes || '',
      services: item.services || [],
    }));
  },
  
  async createSubcontractor(subcontractor: Partial<UnifiedSubcontractor>): Promise<UnifiedSubcontractor> {
    const id = subcontractor.id || uuidv4();
    
    const dbSubcontractor = {
      id,
      quote_id: subcontractor.quoteId || subcontractor.quote_id || '',
      name: subcontractor.name || 'Unnamed Subcontractor',
      description: subcontractor.description || '',
      cost: subcontractor.cost || 0,
      frequency: subcontractor.frequency || 'monthly',
      email: subcontractor.email || '',
      phone: subcontractor.phone || '',
      service: subcontractor.service || '',
      notes: subcontractor.notes || '',
      services: subcontractor.services || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .insert([dbSubcontractor])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subcontractor:', error);
      throw error;
    }
    
    return {
      id: data.id,
      quoteId: data.quote_id,
      name: data.name,
      description: data.description || '',
      cost: data.cost || 0,
      frequency: data.frequency || 'monthly',
      email: data.email || '',
      phone: data.phone || '',
      service: data.service || '',
      notes: data.notes || '',
      services: data.services || [],
    };
  },
  
  async updateSubcontractor(id: string, subcontractor: Partial<UnifiedSubcontractor>): Promise<UnifiedSubcontractor> {
    const dbSubcontractor = {
      name: subcontractor.name,
      description: subcontractor.description,
      cost: subcontractor.cost,
      frequency: subcontractor.frequency,
      email: subcontractor.email,
      phone: subcontractor.phone,
      service: subcontractor.service,
      notes: subcontractor.notes,
      services: subcontractor.services,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .update(dbSubcontractor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating subcontractor:', error);
      throw error;
    }
    
    return {
      id: data.id,
      quoteId: data.quote_id,
      name: data.name,
      description: data.description || '',
      cost: data.cost || 0,
      frequency: data.frequency || 'monthly',
      email: data.email || '',
      phone: data.phone || '',
      service: data.service || '',
      notes: data.notes || '',
      services: data.services || [],
    };
  },
  
  async deleteSubcontractor(id: string): Promise<{ id: string }> {
    const { error } = await supabase
      .from('quote_subcontractors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting subcontractor:', error);
      throw error;
    }
    
    return { id };
  }
};

export default quoteSubcontractorsApi;
