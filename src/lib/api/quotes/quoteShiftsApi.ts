
import { supabase } from '@/lib/supabase';
import { QuoteShift } from '@/lib/types/quotes';
import { convertToQuoteShift, prepareQuoteShiftForApi } from './utils/quoteTypeConversions';

// Fetch all shifts for a quote
export const fetchQuoteShiftsByQuoteId = async (quoteId: string): Promise<QuoteShift[]> => {
  const { data, error } = await supabase
    .from('quote_shifts')
    .select('*')
    .eq('quote_id', quoteId)
    .order('id');

  if (error) {
    console.error('Error fetching quote shifts:', error);
    throw new Error(`Failed to fetch quote shifts: ${error.message}`);
  }

  return (data || []).map(shift => convertToQuoteShift(shift));
};

// Create a new shift for a quote
export const createQuoteShiftMutation = async (shift: Omit<QuoteShift, 'id'>): Promise<QuoteShift> => {
  const apiData = prepareQuoteShiftForApi(shift as QuoteShift);
  
  // Remove ID since we're creating a new record
  delete apiData.id;
  
  const { data, error } = await supabase
    .from('quote_shifts')
    .insert([apiData])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote shift:', error);
    throw new Error(`Failed to create quote shift: ${error.message}`);
  }

  return convertToQuoteShift(data);
};

// Update an existing shift
export const updateQuoteShiftMutation = async (shift: QuoteShift): Promise<QuoteShift> => {
  const apiData = prepareQuoteShiftForApi(shift);

  const { data, error } = await supabase
    .from('quote_shifts')
    .update(apiData)
    .eq('id', shift.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote shift:', error);
    throw new Error(`Failed to update quote shift: ${error.message}`);
  }

  return convertToQuoteShift(data);
};

// Delete a shift
export const deleteQuoteShiftMutation = async (shiftId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_shifts')
    .delete()
    .eq('id', shiftId);

  if (error) {
    console.error('Error deleting quote shift:', error);
    throw new Error(`Failed to delete quote shift: ${error.message}`);
  }
};
