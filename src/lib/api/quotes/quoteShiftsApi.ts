
import { supabase } from '@/lib/supabase';
import { QuoteShift } from '@/lib/award/types';
import { dbToQuoteShift, quoteShiftToDb } from './adapters';

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
  
  return (data || []).map(dbToQuoteShift);
};

// Add shifts to a quote
export const addQuoteShifts = async (quoteId: string, shifts: Partial<QuoteShift>[]) => {
  if (!quoteId || !shifts.length) return [];
  
  const shiftsWithQuoteId = shifts.map(shift => 
    quoteShiftToDb({
      ...shift,
      quoteId
    })
  );
  
  // Insert shifts one by one to avoid Supabase type validation issues
  let allInsertedShifts: QuoteShift[] = [];
  
  for (const shiftData of shiftsWithQuoteId) {
    const { data, error } = await supabase
      .from('quote_shifts')
      .insert(shiftData)
      .select();
    
    if (error) {
      console.error('Error adding shift:', error);
      throw new Error(error.message);
    }
    
    if (data && data.length > 0) {
      allInsertedShifts = [...allInsertedShifts, ...data.map(dbToQuoteShift)];
    }
  }
  
  return allInsertedShifts;
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
