
import { Day as AwardDay } from '@/lib/award/types';
import { Day as QuoteDay } from '@/lib/types/award/types';

/**
 * Converts a string day to the appropriate Day type
 * This helps us handle inconsistencies between different Day type definitions
 */
export function adaptDay(day: string): AwardDay | QuoteDay {
  return day as AwardDay;
}

/**
 * Type assertion helper to safely cast QuoteShift types between different modules
 */
export function adaptQuoteShift<T, U>(shift: T): U {
  return shift as unknown as U;
}

/**
 * Type assertion helper for Quote objects between different modules
 */
export function adaptQuote<T, U>(quote: T): U {
  return quote as unknown as U;
}

/**
 * Type assertion helper for SystemUser objects between different modules
 */
export function adaptSystemUser<T, U>(user: T): U {
  return user as unknown as U;
}
