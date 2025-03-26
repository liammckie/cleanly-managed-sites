
import { Day, EmployeeLevel, EmploymentType } from '@/lib/award/types';
import { QuoteShift } from '@/lib/types/quotes';

/**
 * Converts API response data to strongly typed QuoteShift objects
 */
export function convertToQuoteShift(apiData: any): QuoteShift {
  return {
    id: apiData.id,
    quoteId: apiData.quote_id,
    day: apiData.day as Day,
    startTime: apiData.start_time,
    endTime: apiData.end_time,
    breakDuration: apiData.break_duration,
    numberOfCleaners: apiData.number_of_cleaners || 1,
    employmentType: apiData.employment_type as EmploymentType,
    level: apiData.level as EmployeeLevel,
    allowances: Array.isArray(apiData.allowances) 
      ? apiData.allowances.map((a: any) => a.toString())
      : [],
    estimatedCost: apiData.estimated_cost || 0,
    location: apiData.location || '',
    notes: apiData.notes || ''
  };
}

/**
 * Prepares QuoteShift data for API submission
 */
export function prepareQuoteShiftForApi(shift: QuoteShift): any {
  return {
    id: shift.id,
    quote_id: shift.quoteId,
    day: shift.day,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    number_of_cleaners: shift.numberOfCleaners,
    employment_type: shift.employmentType,
    level: shift.level,
    allowances: shift.allowances,
    estimated_cost: shift.estimatedCost,
    location: shift.location,
    notes: shift.notes
  };
}
