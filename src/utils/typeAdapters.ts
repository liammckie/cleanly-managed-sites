
import { Day } from '@/types/common';

/**
 * Converts any day string to the Day type
 * This helps bridge the gap between different parts of the application
 * that might use different day formats
 */
export function adaptDay(day: string): Day {
  return day as Day;
}
