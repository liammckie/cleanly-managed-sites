
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export file utilities
export * from './fileUtils';

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string, formatStr: string = 'PPP'): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), formatStr);
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid date';
  }
}

/**
 * Format a currency value
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'AUD'): string | null {
  if (amount === null || amount === undefined) return null;
  return new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
}

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
};
