
/**
 * Utility functions to convert between camelCase and snake_case for database operations
 */

/**
 * Converts an object's keys from camelCase to snake_case
 * @param obj Object with camelCase keys
 * @returns Object with snake_case keys
 */
export function toSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Handle arrays - process each item
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }

  // Process the object
  return Object.keys(obj).reduce((result, key) => {
    const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    const value = obj[key];
    
    // Recursively process nested objects/arrays
    result[snakeCaseKey] = value && typeof value === 'object' ? toSnakeCase(value) : value;
    
    return result;
  }, {} as Record<string, any>);
}

/**
 * Converts an object's keys from snake_case to camelCase
 * @param obj Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function toCamelCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Handle arrays - process each item
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }

  // Process the object
  return Object.keys(obj).reduce((result, key) => {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    
    // Recursively process nested objects/arrays
    result[camelCaseKey] = value && typeof value === 'object' ? toCamelCase(value) : value;
    
    return result;
  }, {} as Record<string, any>);
}

/**
 * Maps data to the database format (camelCase to snake_case)
 */
export function mapToDb<T extends Record<string, any>>(data: T): Record<string, any> {
  return toSnakeCase(data);
}

/**
 * Maps data from the database format (snake_case to camelCase)
 */
export function mapFromDb<T extends Record<string, any>>(data: T): Record<string, any> {
  return toCamelCase(data);
}
