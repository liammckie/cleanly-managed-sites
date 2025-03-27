
import { QuoteShift } from '@/lib/award/types';
import { Day, EmployeeLevel, EmploymentType } from '@/types/common';

// Frontend-style QuoteShift with camelCase properties
export interface FrontendQuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

// Convert from backend (snake_case) to frontend (camelCase)
export function dbToFrontendShift(shift: QuoteShift): FrontendQuoteShift {
  return {
    id: shift.id,
    quoteId: shift.quote_id,
    day: shift.day,
    startTime: shift.start_time,
    endTime: shift.end_time,
    breakDuration: shift.break_duration,
    numberOfCleaners: shift.number_of_cleaners,
    employmentType: shift.employment_type,
    level: shift.level,
    allowances: shift.allowances,
    estimatedCost: shift.estimated_cost,
    location: shift.location || '',
    notes: shift.notes || ''
  };
}

// Convert from frontend (camelCase) to backend (snake_case)
export function frontendToDbShift(shift: FrontendQuoteShift): QuoteShift {
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
