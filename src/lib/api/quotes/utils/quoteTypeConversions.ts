
import { Day, EmployeeLevel, EmploymentType } from '@/lib/award/types';
import { Json } from '@/lib/types';
import { QuoteShift } from '@/lib/types/award/types';

/**
 * Converts DB quote shift data to the QuoteShift type
 */
export function convertDbQuoteShiftToModel(dbShift: any): QuoteShift {
  // Convert the day string to the Day type
  const day = dbShift.day as Day;
  
  // Convert employment type string to EmploymentType
  const employmentType = dbShift.employment_type as EmploymentType;
  
  // Convert level number to EmployeeLevel
  const level = Number(dbShift.level) as EmployeeLevel;
  
  // Convert allowances JSON array to string array
  const allowances = Array.isArray(dbShift.allowances) 
    ? dbShift.allowances.map(a => String(a))
    : [];
  
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day,
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType,
    level,
    allowances,
    estimatedCost: dbShift.estimated_cost,
    location: dbShift.location || '',
    notes: dbShift.notes || ''
  };
}

/**
 * Converts a QuoteShift model to a DB-ready object
 */
export function convertModelQuoteShiftToDb(shift: Partial<QuoteShift>): any {
  return {
    quote_id: shift.quoteId,
    day: shift.day,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    number_of_cleaners: shift.numberOfCleaners,
    employment_type: shift.employmentType,
    level: shift.level,
    allowances: shift.allowances || [],
    estimated_cost: shift.estimatedCost || 0,
    location: shift.location,
    notes: shift.notes
  };
}
