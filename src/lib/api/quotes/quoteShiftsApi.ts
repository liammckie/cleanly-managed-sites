
import { supabase } from '@/lib/supabase';
import { QuoteShift } from '@/types/models';

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

  return data.map(shift => ({
    id: shift.id,
    quoteId: shift.quote_id,
    day: shift.day,
    startTime: shift.start_time,
    endTime: shift.end_time,
    breakDuration: shift.break_duration,
    numberOfCleaners: shift.number_of_cleaners,
    employmentType: shift.employment_type,
    level: shift.level,
    allowances: Array.isArray(shift.allowances) ? shift.allowances : [],
    estimatedCost: shift.estimated_cost,
    location: shift.location || '',
    notes: shift.notes || ''
  }));
};

// Create a new shift for a quote
export const createQuoteShift = async (shiftData: Partial<QuoteShift>): Promise<QuoteShift> => {
  const { data, error } = await supabase
    .from('quote_shifts')
    .insert([{
      quote_id: shiftData.quoteId,
      day: shiftData.day,
      start_time: shiftData.startTime,
      end_time: shiftData.endTime,
      break_duration: shiftData.breakDuration,
      number_of_cleaners: shiftData.numberOfCleaners,
      employment_type: shiftData.employmentType,
      level: shiftData.level,
      allowances: shiftData.allowances || [],
      estimated_cost: shiftData.estimatedCost || 0,
      location: shiftData.location,
      notes: shiftData.notes
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote shift:', error);
    throw new Error(`Failed to create quote shift: ${error.message}`);
  }

  return {
    id: data.id,
    quoteId: data.quote_id,
    day: data.day,
    startTime: data.start_time,
    endTime: data.end_time,
    breakDuration: data.break_duration,
    numberOfCleaners: data.number_of_cleaners,
    employmentType: data.employment_type,
    level: data.level,
    allowances: Array.isArray(data.allowances) ? data.allowances : [],
    estimatedCost: data.estimated_cost,
    location: data.location || '',
    notes: data.notes || ''
  };
};

// Update an existing quote shift
export const updateQuoteShift = async (shiftData: QuoteShift): Promise<QuoteShift> => {
  const { data, error } = await supabase
    .from('quote_shifts')
    .update({
      day: shiftData.day,
      start_time: shiftData.startTime,
      end_time: shiftData.endTime,
      break_duration: shiftData.breakDuration,
      number_of_cleaners: shiftData.numberOfCleaners,
      employment_type: shiftData.employmentType,
      level: shiftData.level,
      allowances: shiftData.allowances || [],
      estimated_cost: shiftData.estimatedCost,
      location: shiftData.location,
      notes: shiftData.notes
    })
    .eq('id', shiftData.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote shift:', error);
    throw new Error(`Failed to update quote shift: ${error.message}`);
  }

  return {
    id: data.id,
    quoteId: data.quote_id,
    day: data.day,
    startTime: data.start_time,
    endTime: data.end_time,
    breakDuration: data.break_duration,
    numberOfCleaners: data.number_of_cleaners,
    employmentType: data.employment_type,
    level: data.level,
    allowances: Array.isArray(data.allowances) ? data.allowances : [],
    estimatedCost: data.estimated_cost,
    location: data.location || '',
    notes: data.notes || ''
  };
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
