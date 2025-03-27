
import { QuoteShift, FrontendQuoteShift } from '@/types/models';

/**
 * Convert between snake_case backend and camelCase frontend versions of QuoteShift
 */
export function adaptQuoteShift(shift: Partial<QuoteShift> | Partial<FrontendQuoteShift>): QuoteShift {
  // Check if this is a frontend or backend object and convert accordingly
  const isBackendObject = 'start_time' in shift;
  
  if (isBackendObject) {
    // Convert from backend to unified format
    const backendShift = shift as Partial<QuoteShift>;
    return {
      id: backendShift.id || '',
      quote_id: backendShift.quote_id,
      day: backendShift.day!,
      start_time: backendShift.start_time!,
      end_time: backendShift.end_time!,
      break_duration: backendShift.break_duration!,
      number_of_cleaners: backendShift.number_of_cleaners!,
      employment_type: backendShift.employment_type!,
      level: backendShift.level!,
      allowances: backendShift.allowances || [],
      estimated_cost: backendShift.estimated_cost!,
      location: backendShift.location,
      notes: backendShift.notes,
      
      // Add camelCase aliases for frontend compatibility
      quoteId: backendShift.quote_id,
      startTime: backendShift.start_time!,
      endTime: backendShift.end_time!,
      breakDuration: backendShift.break_duration!,
      numberOfCleaners: backendShift.number_of_cleaners!,
      employmentType: backendShift.employment_type!,
      estimatedCost: backendShift.estimated_cost!
    };
  } else {
    // Convert from frontend to unified format
    const frontendShift = shift as Partial<FrontendQuoteShift>;
    return {
      id: frontendShift.id || '',
      day: frontendShift.day!,
      start_time: frontendShift.startTime!,
      end_time: frontendShift.endTime!,
      break_duration: frontendShift.breakDuration!,
      number_of_cleaners: frontendShift.numberOfCleaners!,
      employment_type: frontendShift.employmentType!,
      level: frontendShift.level!,
      allowances: frontendShift.allowances || [],
      estimated_cost: frontendShift.estimatedCost!,
      location: frontendShift.location,
      notes: frontendShift.notes,
      quote_id: frontendShift.quoteId,
      
      // Add camelCase aliases for frontend compatibility
      quoteId: frontendShift.quoteId,
      startTime: frontendShift.startTime!,
      endTime: frontendShift.endTime!,
      breakDuration: frontendShift.breakDuration!,
      numberOfCleaners: frontendShift.numberOfCleaners!,
      employmentType: frontendShift.employmentType!,
      estimatedCost: frontendShift.estimatedCost!
    };
  }
}

/**
 * Convert a DbOverheadProfile to an OverheadProfile
 */
export function adaptOverheadProfile(dbProfile: any) {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage
  };
}
