
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue }
export interface JsonArray extends Array<JsonValue> {}

/**
 * Parse and convert a JSON value to a specific type with default values
 * 
 * @param jsonData The JSON data to parse, could be a string or already parsed object
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed object with default values for missing properties
 */
export function asJsonObject<T>(jsonData: any, defaultValue: T): T {
  // If jsonData is falsy, return default
  if (!jsonData) return defaultValue;
  
  try {
    // If jsonData is a string, try to parse it
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // If the result is not an object or is null, return default
    if (typeof data !== 'object' || data === null) return defaultValue;
    
    // Merge with default values to ensure all expected properties exist
    return { ...defaultValue, ...data };
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return defaultValue;
  }
}

/**
 * Parse and convert a JSON string to an array with a default value
 * 
 * @param jsonData The JSON data to parse, could be a string or already parsed array
 * @param defaultValue The default array to return if parsing fails
 * @returns The parsed array or default value
 */
export function asJsonArray<T>(jsonData: any, defaultValue: T[]): T[] {
  // If jsonData is falsy, return default
  if (!jsonData) return defaultValue;
  
  try {
    // If jsonData is a string, try to parse it
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // If the result is not an array, return default
    if (!Array.isArray(data)) return defaultValue;
    
    return data;
  } catch (error) {
    console.error('Error parsing JSON array:', error);
    return defaultValue;
  }
}

/**
 * Safely stringify an object to JSON
 * 
 * @param data The data to stringify
 * @returns JSON string or empty object string if error
 */
export function safeStringify(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying data:', error);
    return '{}';
  }
}
