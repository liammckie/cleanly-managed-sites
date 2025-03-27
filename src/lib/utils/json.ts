
import { Json } from '@/lib/types';

/**
 * Safely parse a JSON string into a typed object
 * @param jsonString The JSON string to parse
 * @returns The parsed object or null if parsing fails
 */
export function parseJson<T>(jsonString: string | null | undefined): T | null {
  if (!jsonString) return null;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Safely converts a JSON object to a specific type
 * Returns the JSON object cast to type T if it's a non-null object, or a default empty object
 */
export function convertJsonToType<T>(jsonData: Json): T {
  if (typeof jsonData === 'object' && jsonData !== null) {
    return jsonData as unknown as T;
  }
  return {} as T;
}

/**
 * Converts a JSON object or string to a string representation
 */
export function jsonToString(json: Json | null | undefined): string {
  if (json === null || json === undefined) return '';
  if (typeof json === 'string') return json;
  
  try {
    return JSON.stringify(json, null, 2);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return '';
  }
}

/**
 * Safely access a property from a JSON object with a default value
 */
export function getJsonProperty<T>(json: Json | null | undefined, key: string, defaultValue: T): T {
  if (!json || typeof json !== 'object' || json === null || Array.isArray(json)) {
    return defaultValue;
  }
  
  const typedJson = json as {[key: string]: any};
  return (key in typedJson && typedJson[key] !== undefined && typedJson[key] !== null)
    ? typedJson[key] as T
    : defaultValue;
}

/**
 * Convert JSON to a typed object with defaultValues for missing properties
 */
export function asJsonObject<T>(json: Json | null | undefined, defaultValues: T): T {
  if (!json) return defaultValues;
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch (e) {
      return defaultValues;
    }
  }
  if (typeof json !== 'object' || json === null) return defaultValues;
  
  return { ...defaultValues, ...json as Object } as T;
}

/**
 * Safe JSON stringify with error handling
 */
export function safeJsonStringify(value: any): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Error stringifying value:', error);
    return '';
  }
}
