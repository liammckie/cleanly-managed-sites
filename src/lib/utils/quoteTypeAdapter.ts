
import { Day, EmployeeLevel, EmploymentType, Frequency } from '@/types/common';
import { 
  Quote as ModelsQuote, 
  QuoteShift as ModelsQuoteShift,
  QuoteSubcontractor as ModelsQuoteSubcontractor
} from '@/types/models';
import { 
  Quote as LibQuote, 
  QuoteShift as LibQuoteShift,
  QuoteSubcontractor as LibQuoteSubcontractor
} from '@/lib/types/quotes';
import { toDay, toEmployeeLevel, toEmploymentType, toFrequency } from '@/lib/api/quotes/utils/quoteDbTypeAdapter';

/**
 * Adapts a QuoteShift from one module to another
 */
export function adaptQuoteShift(shift: LibQuoteShift | ModelsQuoteShift): ModelsQuoteShift {
  if (!shift) return shift as ModelsQuoteShift;
  
  return {
    ...shift,
    day: typeof shift.day === 'string' ? toDay(shift.day) : shift.day,
    employmentType: typeof shift.employmentType === 'string' ? toEmploymentType(shift.employmentType) : shift.employmentType,
    level: typeof shift.level === 'number' ? toEmployeeLevel(shift.level.toString()) : shift.level,
  } as ModelsQuoteShift;
}

/**
 * Adapts a QuoteSubcontractor from one module to another
 */
export function adaptQuoteSubcontractor(subcontractor: LibQuoteSubcontractor | ModelsQuoteSubcontractor): ModelsQuoteSubcontractor {
  if (!subcontractor) return subcontractor as ModelsQuoteSubcontractor;
  
  return {
    ...subcontractor,
    frequency: typeof subcontractor.frequency === 'string' ? toFrequency(subcontractor.frequency) : subcontractor.frequency,
  } as ModelsQuoteSubcontractor;
}

/**
 * Adapts a Quote from lib/types to types/models
 */
export function adaptQuote(quote: LibQuote): ModelsQuote {
  if (!quote) return quote as ModelsQuote;
  
  const adapted: ModelsQuote = {
    ...quote,
    // Convert shifts if present
    shifts: quote.shifts ? quote.shifts.map(adaptQuoteShift) : undefined,
    // Convert subcontractors if present
    subcontractors: quote.subcontractors ? quote.subcontractors.map(adaptQuoteSubcontractor) : undefined,
    // Ensure status is the correct enum type
    status: toQuoteStatus(quote.status as string),
  } as ModelsQuote;
  
  return adapted;
}

/**
 * Convert string status to QuoteStatus enum
 */
function toQuoteStatus(status: string): 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted' {
  switch (status) {
    case 'draft':
    case 'sent':
    case 'approved':
    case 'rejected':
    case 'expired':
    case 'pending':
    case 'accepted':
      return status as 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';
    default:
      return 'draft';
  }
}
