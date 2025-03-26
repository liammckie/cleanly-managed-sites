
import { format, differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Format a date string into a human-readable format
 */
export const formatDate = (date?: string | Date | null): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date?: string | Date | null): boolean => {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return dateObj < new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is within a certain number of days from now
 */
export const isWithinDays = (date?: string | Date | null, days: number = 30): boolean => {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return differenceInDays(dateObj, new Date()) <= days;
  } catch (error) {
    return false;
  }
};

/**
 * Get time remaining until a date in a human readable format
 */
export const getTimeRemaining = (date?: string | Date | null): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    
    const days = differenceInDays(dateObj, new Date());
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 30) return `${days} days`;
    
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } catch (error) {
    return 'Invalid date';
  }
};
