
/**
 * Format a date string or Date object to a human-readable format
 * @param {string | Date} date - The date to format
 * @param {string} format - The format to use (default: 'short')
 * @returns {string} Formatted date string
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    : { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      };
  
  return dateObj.toLocaleDateString(undefined, options);
}

/**
 * Format a time string or Date object to a human-readable format
 * @param {string | Date} time - The time to format 
 * @returns {string} Formatted time string
 */
export function formatTime(time: string | Date): string {
  if (!time) return 'N/A';
  
  const dateObj = typeof time === 'string' ? new Date(time) : time;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid time';
  }
  
  return dateObj.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

/**
 * Calculate the difference between two dates in days
 * @param {Date | string} date1 - The first date
 * @param {Date | string} date2 - The second date
 * @returns {number} The difference in days
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
