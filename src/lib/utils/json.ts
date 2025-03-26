
/**
 * Safely parse a JSON string and return an object
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed object or the default value
 */
export function asJsonObject<T extends Record<string, any>>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  try {
    if (typeof jsonString === 'string') {
      return JSON.parse(jsonString);
    } else if (typeof jsonString === 'object') {
      return jsonString as T;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Safely stringify an object to JSON
 * @param obj The object to stringify
 * @returns The JSON string or an empty object string if stringification fails
 */
export function asJsonString(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error stringifying object:', error);
    return '{}';
  }
}

/**
 * Parse a JSON string that could be in string format or already as an object
 * @param jsonData The JSON data to parse
 * @returns The parsed object or an empty object if parsing fails
 */
export function parseJsonData(jsonData: string | object | null | undefined): Record<string, any> {
  if (!jsonData) return {};
  
  if (typeof jsonData === 'string') {
    try {
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error parsing JSON string:', error);
      return {};
    }
  }
  
  if (typeof jsonData === 'object') {
    return jsonData as Record<string, any>;
  }
  
  return {};
}
