
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Safely convert a JSON value to an object
 * @param jsonValue The JSON value to convert
 * @param defaultValue Default object to return if conversion fails
 * @returns The converted object or the default value
 */
export function asJsonObject<T extends object>(jsonValue: any, defaultValue: T): T {
  if (!jsonValue) return defaultValue;
  
  try {
    if (typeof jsonValue === 'string') {
      return JSON.parse(jsonValue) as T;
    } else if (typeof jsonValue === 'object') {
      return jsonValue as T;
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  
  return defaultValue;
}

/**
 * Safely stringify a value to JSON
 * @param value The value to stringify
 * @returns JSON string or empty object string if conversion fails
 */
export function toJsonString(value: any): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Error stringifying to JSON:', error);
    return '{}';
  }
}
