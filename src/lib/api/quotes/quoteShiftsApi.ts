
import { supabase } from '@/integrations/supabase/client';
import { QuoteShift } from '@/lib/types/quoteTypes';
import { v4 as uuidv4 } from 'uuid';

export const quoteShiftsApi = {
  // Get all shifts for a quote
  async getShifts(quoteId: string): Promise<QuoteShift[]> {
    const { data, error } = await supabase
      .from('quote_shifts')
      .select('*')
      .eq('quote_id', quoteId);
    
    if (error) {
      console.error('Error fetching quote shifts:', error);
      throw error;
    }
    
    return data as unknown as QuoteShift[];
  },
  
  // Create a new shift
  async createShift(shiftData: Partial<QuoteShift>): Promise<QuoteShift> {
    // Ensure required fields
    if (!shiftData.id) {
      shiftData.id = uuidv4();
    }
    
    const { data, error } = await supabase
      .from('quote_shifts')
      .insert([shiftData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating quote shift:', error);
      throw error;
    }
    
    return data as unknown as QuoteShift;
  },
  
  // Update a shift
  async updateShift(shiftId: string, shiftData: Partial<QuoteShift>): Promise<QuoteShift> {
    const { data, error } = await supabase
      .from('quote_shifts')
      .update(shiftData)
      .eq('id', shiftId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating quote shift:', error);
      throw error;
    }
    
    return data as unknown as QuoteShift;
  },
  
  // Delete a shift
  async deleteShift(shiftId: string): Promise<void> {
    const { error } = await supabase
      .from('quote_shifts')
      .delete()
      .eq('id', shiftId);
    
    if (error) {
      console.error('Error deleting quote shift:', error);
      throw error;
    }
  },
};
