
import { supabase } from '@/integrations/supabase/client';
import { QuoteSubcontractor } from '@/lib/types/quoteTypes';
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
    
    return data as unknown as QuoteSubcontractor[];
  },
  
  // Create a new subcontractor
  async createSubcontractor(subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> {
    // Ensure required fields
    if (!subcontractorData.id) {
      subcontractorData.id = uuidv4();
    }
    
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .insert([subcontractorData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating quote subcontractor:', error);
      throw error;
    }
    
    return data as unknown as QuoteSubcontractor;
  },
  
  // Update an existing subcontractor
  async updateSubcontractor(subcontractorId: string, subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> {
    const { data, error } = await supabase
      .from('quote_subcontractors')
      .update(subcontractorData)
      .eq('id', subcontractorId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating quote subcontractor:', error);
      throw error;
    }
    
    return data as unknown as QuoteSubcontractor;
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
