
/**
 * Utility functions for validating common data formats
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Basic phone validation - can be customized based on your requirements
  // This allows formats like: +1234567890, 123-456-7890, (123) 456-7890
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  return phoneRegex.test(phone);
}

export function isValidPostcode(postcode: string): boolean {
  // This is a simple validation that allows 4-10 alphanumeric characters
  // You may want to customize this based on your specific country format needs
  const postcodeRegex = /^[a-zA-Z0-9]{4,10}$/;
  return postcodeRegex.test(postcode);
}

export function isValidABN(abn: string): boolean {
  // Australian Business Number validation
  // Should be 11 digits with no spaces or characters
  const abnRegex = /^\d{11}$/;
  return abnRegex.test(abn);
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
