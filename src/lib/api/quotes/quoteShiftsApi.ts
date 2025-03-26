
import { supabase } from '@/integrations/supabase/client';
import { QuoteShift } from '@/lib/types/quotes';
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
    
    return (data || []).map((item) => ({
      id: item.id,
      quoteId: item.quote_id,
      day: item.day,
      startTime: item.start_time,
      endTime: item.end_time,
      breakDuration: item.break_duration,
      numberOfCleaners: item.number_of_cleaners,
      employmentType: item.employment_type,
      level: item.level,
      allowances: Array.isArray(item.allowances) ? item.allowances : [],
      estimatedCost: item.estimated_cost,
      location: item.location || '',
      notes: item.notes || ''
    }));
  },
  
  // Create a new shift
  async createShift(shiftData: Partial<QuoteShift>): Promise<QuoteShift> {
    // Ensure required fields
    if (!shiftData.id) {
      shiftData.id = uuidv4();
    }
    
    const dbShiftData = {
      id: shiftData.id,
      quote_id: shiftData.quoteId,
      day: shiftData.day,
      start_time: shiftData.startTime,
      end_time: shiftData.endTime,
      break_duration: shiftData.breakDuration || 0,
      number_of_cleaners: shiftData.numberOfCleaners || 1,
      employment_type: shiftData.employmentType,
      level: shiftData.level,
      allowances: shiftData.allowances || [],
      estimated_cost: shiftData.estimatedCost || 0,
      location: shiftData.location || '',
      notes: shiftData.notes || ''
    };
    
    const { data, error } = await supabase
      .from('quote_shifts')
      .insert([dbShiftData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating quote shift:', error);
      throw error;
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
  },
  
  // Update a shift
  async updateShift(shiftId: string, shiftData: Partial<QuoteShift>): Promise<QuoteShift> {
    const dbShiftData: any = {};
    
    if (shiftData.quoteId) dbShiftData.quote_id = shiftData.quoteId;
    if (shiftData.day) dbShiftData.day = shiftData.day;
    if (shiftData.startTime) dbShiftData.start_time = shiftData.startTime;
    if (shiftData.endTime) dbShiftData.end_time = shiftData.endTime;
    if (shiftData.breakDuration !== undefined) dbShiftData.break_duration = shiftData.breakDuration;
    if (shiftData.numberOfCleaners !== undefined) dbShiftData.number_of_cleaners = shiftData.numberOfCleaners;
    if (shiftData.employmentType) dbShiftData.employment_type = shiftData.employmentType;
    if (shiftData.level) dbShiftData.level = shiftData.level;
    if (shiftData.allowances) dbShiftData.allowances = shiftData.allowances;
    if (shiftData.estimatedCost !== undefined) dbShiftData.estimated_cost = shiftData.estimatedCost;
    if (shiftData.location !== undefined) dbShiftData.location = shiftData.location;
    if (shiftData.notes !== undefined) dbShiftData.notes = shiftData.notes;
    
    const { data, error } = await supabase
      .from('quote_shifts')
      .update(dbShiftData)
      .eq('id', shiftId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating quote shift:', error);
      throw error;
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
