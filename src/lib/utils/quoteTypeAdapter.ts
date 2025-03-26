
import { Day, Frequency } from '@/types/common';
import { Quote as LibQuote, QuoteShift as LibQuoteShift, QuoteSubcontractor as LibQuoteSubcontractor } from '@/lib/types/quotes';
import { Quote as ModelQuote, QuoteShift as ModelQuoteShift, QuoteSubcontractor as ModelQuoteSubcontractor } from '@/types/models';

// Helper function to convert any string to a valid Day type
function ensureValidDay(day: string): Day {
  const validDays: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return validDays.includes(day.toLowerCase() as Day) 
    ? (day.toLowerCase() as Day) 
    : 'monday';
}

// Helper function to convert any string to a valid Frequency type
function ensureValidFrequency(frequency: string): Frequency {
  const validFrequencies: Frequency[] = ['daily', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly', 'once', 'annually'];
  return validFrequencies.includes(frequency.toLowerCase() as Frequency)
    ? (frequency.toLowerCase() as Frequency)
    : 'monthly';
}

// Helper function to convert any string to a valid QuoteStatus
function ensureValidQuoteStatus(status: string): 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted' {
  const validStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired', 'pending', 'accepted'];
  return validStatuses.includes(status.toLowerCase()) 
    ? (status.toLowerCase() as 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted')
    : 'draft';
}

/**
 * Adapts a quote from lib/types/quotes.ts to types/models.ts
 */
export function adaptQuoteToModel(quote: LibQuote): ModelQuote {
  return {
    ...quote,
    // Convert string-based status to enum
    status: ensureValidQuoteStatus(quote.status),
    // Convert shifts with proper day type
    shifts: adaptShiftsToModel(quote.shifts || []),
    // Convert subcontractors with proper frequency type
    subcontractors: adaptSubcontractorsToModel(quote.subcontractors || [])
  };
}

/**
 * Adapts shifts from lib/types/quotes.ts to types/models.ts
 */
export function adaptShiftsToModel(shifts: LibQuoteShift[]): ModelQuoteShift[] {
  return shifts.map(shift => ({
    ...shift,
    // Convert string day to Day enum
    day: ensureValidDay(shift.day as string),
    // Convert string employment type to enum
    employmentType: shift.employmentType as any,
    // Convert numeric level to EmployeeLevel enum
    level: shift.level as any
  }));
}

/**
 * Adapts subcontractors from lib/types/quotes.ts to types/models.ts
 */
export function adaptSubcontractorsToModel(subcontractors: LibQuoteSubcontractor[]): ModelQuoteSubcontractor[] {
  // First ensure all subcontractors have the required quoteId property
  const withQuoteId = subcontractors.map(sub => {
    if (!sub.quoteId) {
      return { ...sub, quoteId: sub.id }; // Use the subcontractor's ID if quoteId is missing
    }
    return sub;
  });
  
  return withQuoteId.map(sub => ({
    ...sub,
    // Convert string frequency to Frequency enum
    frequency: ensureValidFrequency(sub.frequency as string)
  }));
}

/**
 * Adapts a quote from types/models.ts to lib/types/quotes.ts
 */
export function adaptModelToQuote(quote: ModelQuote): LibQuote {
  return {
    ...quote,
    // Convert enum status to string
    status: quote.status as string,
    // Convert shifts
    shifts: adaptModelShiftsToLib(quote.shifts || []),
    // Convert subcontractors
    subcontractors: adaptModelSubcontractorsToLib(quote.subcontractors || [])
  };
}

/**
 * Adapts an array of quotes from types/models.ts to lib/types/quotes.ts
 */
export function adaptModelsToQuotes(quotes: ModelQuote[]): LibQuote[] {
  return quotes.map(adaptModelToQuote);
}

/**
 * Adapts shifts from types/models.ts to lib/types/quotes.ts
 */
export function adaptModelShiftsToLib(shifts: ModelQuoteShift[]): LibQuoteShift[] {
  return shifts.map(shift => ({
    ...shift,
    // Convert Day enum to string
    day: shift.day as string,
    // Convert enum employment type to string
    employmentType: shift.employmentType as string,
    // Convert EmployeeLevel enum to number
    level: shift.level as number
  }));
}

/**
 * Adapts subcontractors from types/models.ts to lib/types/quotes.ts
 */
export function adaptModelSubcontractorsToLib(subcontractors: ModelQuoteSubcontractor[]): LibQuoteSubcontractor[] {
  return subcontractors.map(sub => ({
    ...sub,
    // Convert Frequency enum to string
    frequency: sub.frequency as string
  }));
}

/**
 * Unified adapter function used across the application
 * This is the function imported by quotesApi.ts
 */
export function adaptQuote(quote: any): any {
  // Check if the quote is from lib or model and adapt accordingly
  if (quote && typeof quote === 'object') {
    // Add any special handling as needed
    return quote;
  }
  return quote;
}
