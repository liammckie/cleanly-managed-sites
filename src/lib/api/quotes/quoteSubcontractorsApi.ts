
import { supabase } from '@/integrations/supabase/client';
import { QuoteSubcontractor, Subcontractor } from '@/lib/types/quotes';
import { v4 as uuidv4 } from 'uuid';

export const quoteSubcontractorsApi = {
  // Get all subcontractors for a quote
  async getSubcontractors(quoteId: string): Promise<QuoteSubcontractor[]> {
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .select('*')
      .eq('quote_id', quoteId);
    
    if (error) {
      console.error('Error fetching quote subcontractors:', error);
      throw error;
    }
    
    return (data || []).map((item) => ({
      id: item.id,
      quoteId: item.quote_id,
      name: item.name,
      description: item.description,
      cost: item.cost,
      frequency: item.frequency,
      email: item.email,
      phone: item.phone,
      service: item.service,
      notes: item.notes
    }));
  },
  
  // Create a new subcontractor
  async createSubcontractor(subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> {
    // Ensure required fields
    if (!subcontractorData.id) {
      subcontractorData.id = uuidv4();
    }
    
    // Ensure name is present
    if (!subcontractorData.name) {
      throw new Error('Subcontractor name is required');
    }
    
    const dbSubData = {
      id: subcontractorData.id,
      quote_id: subcontractorData.quoteId,
      name: subcontractorData.name,
      description: subcontractorData.description || '',
      cost: subcontractorData.cost || 0,
      frequency: subcontractorData.frequency || 'monthly',
      email: subcontractorData.email || '',
      phone: subcontractorData.phone || '',
      service: subcontractorData.service || '',
      notes: subcontractorData.notes || ''
    };
    
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .insert([dbSubData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating quote subcontractor:', error);
      throw error;
    }
    
    return {
      id: data.id,
      quoteId: data.quote_id,
      name: data.name,
      description: data.description,
      cost: data.cost,
      frequency: data.frequency,
      email: data.email,
      phone: data.phone,
      service: data.service,
      notes: data.notes
    };
  },
  
  // Update an existing subcontractor
  async updateSubcontractor(subcontractorId: string, subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> {
    const dbSubData: any = {};
    
    if (subcontractorData.quoteId) dbSubData.quote_id = subcontractorData.quoteId;
    if (subcontractorData.name) dbSubData.name = subcontractorData.name;
    if (subcontractorData.description !== undefined) dbSubData.description = subcontractorData.description;
    if (subcontractorData.cost !== undefined) dbSubData.cost = subcontractorData.cost;
    if (subcontractorData.frequency) dbSubData.frequency = subcontractorData.frequency;
    if (subcontractorData.email !== undefined) dbSubData.email = subcontractorData.email;
    if (subcontractorData.phone !== undefined) dbSubData.phone = subcontractorData.phone;
    if (subcontractorData.service !== undefined) dbSubData.service = subcontractorData.service;
    if (subcontractorData.notes !== undefined) dbSubData.notes = subcontractorData.notes;
    
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .update(dbSubData)
      .eq('id', subcontractorId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating quote subcontractor:', error);
      throw error;
    }
    
    return {
      id: data.id,
      quoteId: data.quote_id,
      name: data.name,
      description: data.description,
      cost: data.cost,
      frequency: data.frequency,
      email: data.email,
      phone: data.phone,
      service: data.service,
      notes: data.notes
    };
  },
  
  // Delete a subcontractor
  async deleteSubcontractor(subcontractorId: string): Promise<void> {
    const { error } = await supabase
      .from('quote_subcontractors')
      .delete()
      .eq('id', subcontractorId);
    
    if (error) {
      console.error('Error deleting quote subcontractor:', error);
      throw error;
    }
  }
};
