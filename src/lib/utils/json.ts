
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
 * Safely access a property from a JSON object
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
