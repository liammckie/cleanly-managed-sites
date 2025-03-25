
// JSON utility functions for type safety

/**
 * Type for JSON-compatible values
 */
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

/**
 * Safely parse a JSON string with error handling
 */
export function parseJson<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

/**
 * Convert a value to a JSON object with a fallback default
 */
export function asJsonObject<T extends Record<string, any>>(
  value: Json | undefined | null,
  defaultValue: T
): T {
  if (!value) return defaultValue;
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return { ...defaultValue, ...parsed };
    } catch (error) {
      return defaultValue;
    }
  }
  
  if (typeof value === 'object' && value !== null) {
    return { ...defaultValue, ...value };
  }
  
  return defaultValue;
}

/**
 * Safely stringify a value to JSON with error handling
 */
export function stringifyJson(value: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Error stringifying to JSON:', error);
    return fallback;
  }
}
