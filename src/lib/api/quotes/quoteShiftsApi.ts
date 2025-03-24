
import { supabase } from '@/lib/supabase';
import { QuoteShift } from '@/lib/award/types';

// Fetch shifts for a quote
export const fetchQuoteShifts = async (quoteId: string) => {
  if (!quoteId) return [];
  
  const { data, error } = await supabase
    .from('quote_shifts')
    .select('*')
    .eq('quote_id', quoteId);
  
  if (error) {
    console.error('Error fetching quote shifts:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Add shifts to a quote
export const addQuoteShifts = async (quoteId: string, shifts: Partial<QuoteShift>[]) => {
  if (!quoteId || !shifts.length) return [];
  
  const shiftsWithQuoteId = shifts.map(shift => ({
    ...shift,
    quote_id: quoteId
  }));
  
  const { data, error } = await supabase
    .from('quote_shifts')
    .insert(shiftsWithQuoteId)
    .select();
  
  if (error) {
    console.error('Error adding shifts:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Update shifts for a quote
export const updateQuoteShifts = async (quoteId: string, shifts: QuoteShift[]) => {
  if (!quoteId) return [];
  
  // Delete all existing shifts
  const { error: deleteError } = await supabase
    .from('quote_shifts')
    .delete()
    .eq('quote_id', quoteId);
  
  if (deleteError) {
    console.error('Error deleting existing shifts:', deleteError);
    throw new Error(deleteError.message);
  }
  
  // If no new shifts, return empty array
  if (!shifts.length) return [];
  
  // Add the new shifts
  return addQuoteShifts(quoteId, shifts);
};
