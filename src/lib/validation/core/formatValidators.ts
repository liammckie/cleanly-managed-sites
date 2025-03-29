
/**
 * Common format validators for strings like emails, dates, etc.
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

/**
 * Validate date is valid and in the past
 */
export const isValidPastDate = (dateString: string): boolean => {
  // First check format
  if (!isValidDateFormat(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid and in the past
  return !isNaN(date.getTime()) && date < now;
};

/**
 * Validate date is valid and in the future
 */
export const isValidFutureDate = (dateString: string): boolean => {
  // First check format
  if (!isValidDateFormat(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid and in the future
  return !isNaN(date.getTime()) && date > now;
};

/**
 * Validate phone format
 */
export const isValidPhone = (phone: string): boolean => {
  // Basic phone validation - can be customized based on your requirements
  // This allows formats like: +1234567890, 123-456-7890, (123) 456-7890
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validate postcode format (customizable by country)
 */
export const isValidPostcode = (postcode: string, country: string = 'australia'): boolean => {
  if (country.toLowerCase() === 'australia') {
    // Australian postcodes are 4 digits
    return /^\d{4}$/.test(postcode);
  } else {
    // Generic postcode validation (4-10 alphanumeric characters)
    return /^[a-zA-Z0-9]{4,10}$/.test(postcode);
  }
};

/**
 * Validate Australian Business Number (ABN)
 */
export const isValidABN = (abn: string): boolean => {
  // Remove spaces
  abn = abn.replace(/\s/g, '');
  
  // ABN must be 11 digits
  if (!/^\d{11}$/.test(abn)) {
    return false;
  }
  
  // Apply ABN validation algorithm
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let sum = 0;
  
  // Subtract 1 from first digit
  const digits = abn.split('').map(Number);
  digits[0] -= 1;
  
  // Calculate weighted sum
  for (let i = 0; i < 11; i++) {
    sum += digits[i] * weights[i];
  }
  
  // Valid if divisible by 89
  return sum % 89 === 0;
};
