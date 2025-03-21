
/**
 * Validates required fields in an object
 * @param data The object to validate
 * @param requiredFields Array of field names that are required
 * @returns Object with field names as keys and error messages as values
 */
export function validateRequired(data: Record<string, any>, requiredFields: string[]): Record<string, string> {
  const errors: Record<string, string> = {};
  
  requiredFields.forEach(field => {
    const value = data[field];
    
    if (value === undefined || value === null || value === '') {
      errors[field] = 'This field is required';
    }
  });
  
  return errors;
}

/**
 * Validates an email address
 * @param email The email to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Allow empty email (if not required)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number
 * @param phone The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Allow empty phone (if not required)
  
  // Basic validation - can be made more specific for different regions
  const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates a date string
 * @param date The date string to validate
 * @returns Boolean indicating if the date is valid
 */
export function isValidDate(date: string): boolean {
  if (!date) return true; // Allow empty date (if not required)
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}
