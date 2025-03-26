
import { supabase } from '@/lib/supabase';
import { QuoteShift } from '@/lib/types/award/types';
import { convertDbQuoteShiftToModel, convertModelQuoteShiftToDb } from './utils/quoteTypeConversions';

// Fetch shifts for a specific quote
export const fetchQuoteShiftsByQuoteId = async (quoteId: string): Promise<QuoteShift[]> => {
  const { data, error } = await supabase
    .from('quote_shifts')
    .select('*')
    .eq('quote_id', quoteId);

  if (error) {
    console.error('Error fetching quote shifts:', error);
    throw new Error(`Failed to fetch quote shifts: ${error.message}`);
  }

  return data.map(shift => convertDbQuoteShiftToModel(shift));
};

// Create a new shift for a quote
export const createQuoteShift = async (shiftData: Partial<QuoteShift>): Promise<QuoteShift> => {
  const dbData = convertModelQuoteShiftToDb(shiftData);
  
  const { data, error } = await supabase
    .from('quote_shifts')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote shift:', error);
    throw new Error(`Failed to create quote shift: ${error.message}`);
  }

  return convertDbQuoteShiftToModel(data);
};

// Update an existing quote shift
export const updateQuoteShift = async (shiftData: QuoteShift): Promise<QuoteShift> => {
  const dbData = convertModelQuoteShiftToDb(shiftData);
  
  const { data, error } = await supabase
    .from('quote_shifts')
    .update(dbData)
    .eq('id', shiftData.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote shift:', error);
    throw new Error(`Failed to update quote shift: ${error.message}`);
  }

  return convertDbQuoteShiftToModel(data);
};

// Delete a quote shift
export const deleteQuoteShift = async (shiftId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_shifts')
    .delete()
    .eq('id', shiftId);

  if (error) {
    console.error('Error deleting quote shift:', error);
    throw new Error(`Failed to delete quote shift: ${error.message}`);
  }
};
