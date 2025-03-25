
/**
 * Format a currency value
 * @param amount The amount to format
 * @param currency The currency code (default: AUD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'AUD'): string {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
}

/**
 * Format a date string to a locale date format
 * @param dateString The date string to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined, options: Intl.DateTimeFormatOptions = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a number with specified decimal places
 * @param value The number to format
 * @param decimalPlaces Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(value: number | null | undefined, decimalPlaces: number = 2): string {
  if (value === null || value === undefined) return '0';
  
  return value.toLocaleString('en-AU', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
}

/**
 * Format a percentage value
 * @param value The percentage value (e.g., 0.25 for 25%)
 * @param decimalPlaces Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | null | undefined, decimalPlaces: number = 1): string {
  if (value === null || value === undefined) return '0%';
  
  return `${(value * 100).toLocaleString('en-AU', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  })}%`;
}
