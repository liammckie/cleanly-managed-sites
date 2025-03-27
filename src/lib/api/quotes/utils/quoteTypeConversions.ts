
import { v4 as uuidv4 } from 'uuid';
import { QuoteShift } from '@/lib/types/quotes';

export function dbToQuoteShift(dbShift: any): QuoteShift {
  return {
    id: dbShift.id || uuidv4(),
    quote_id: dbShift.quote_id || '',
    day: dbShift.day || 'monday',
    start_time: dbShift.start_time || '08:00',
    end_time: dbShift.end_time || '16:00', 
    break_duration: dbShift.break_duration || 30,
    number_of_cleaners: dbShift.number_of_cleaners || 1,
    employment_type: dbShift.employment_type || 'casual',
    level: dbShift.level || 1,
    allowances: dbShift.allowances || [],
    estimated_cost: dbShift.estimated_cost || 0,
    location: dbShift.location || '',
    notes: dbShift.notes || '',
    
    // Add camelCase aliases for component compatibility
    quoteId: dbShift.quote_id || '',
    startTime: dbShift.start_time || '08:00',
    endTime: dbShift.end_time || '16:00',
    breakDuration: dbShift.break_duration || 30,
    numberOfCleaners: dbShift.number_of_cleaners || 1,
    employmentType: dbShift.employment_type || 'casual',
    estimatedCost: dbShift.estimated_cost || 0
  };
}

export function quoteShiftToDb(shift: QuoteShift): any {
  return {
    id: shift.id,
    quote_id: shift.quote_id || shift.quoteId,
    day: shift.day,
    start_time: shift.start_time || shift.startTime,
    end_time: shift.end_time || shift.endTime,
    break_duration: shift.break_duration || shift.breakDuration,
    number_of_cleaners: shift.number_of_cleaners || shift.numberOfCleaners,
    employment_type: shift.employment_type || shift.employmentType,
    level: shift.level,
    allowances: shift.allowances,
    estimated_cost: shift.estimated_cost || shift.estimatedCost,
    location: shift.location,
    notes: shift.notes
  };
}
