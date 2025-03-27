/**
 * Utility functions for adapting data between different formats and systems
 */

export const adaptFrequencyFormat = (frequency: string): string => {
  // Map from various frequency formats to standardized ones
  const frequencyMap: Record<string, string> = {
    'daily': 'daily',
    'weekly': 'weekly',
    'fortnightly': 'fortnightly',
    'biweekly': 'fortnightly',
    'monthly': 'monthly',
    'quarterly': 'quarterly',
    'biannually': 'biannually',
    'semi-annually': 'biannually',
    'annually': 'annually',
    'yearly': 'annually',
    'once': 'once',
    'one-time': 'once'
  };

  return frequencyMap[frequency.toLowerCase()] || frequency;
};

export const adaptDayFormat = (day: string): string => {
  // Map from various day formats to standardized ones
  const dayMap: Record<string, string> = {
    'mon': 'monday',
    'tue': 'tuesday',
    'wed': 'wednesday',
    'thu': 'thursday',
    'fri': 'friday',
    'sat': 'saturday',
    'sun': 'sunday',
    'weekday': 'weekday',
    'weekend': 'weekend',
    'public_holiday': 'public_holiday'
  };

  return dayMap[day.toLowerCase()] || day;
};

export const adaptDateFormat = (date: string, format: 'iso' | 'display' = 'iso'): string => {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
      return date; // Return as is if not a valid date
    }
    
    if (format === 'iso') {
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    } else {
      return d.toLocaleDateString(); // Based on locale
    }
  } catch (e) {
    return date; // Return as is if any error
  }
};

import { QuoteRecord } from '@/lib/types';

export function adaptQuoteData(quote: QuoteRecord) {
  // Default implementation to adapt quote data structure
  return {
    ...quote,
    // Add any needed transformations here
  };
}
