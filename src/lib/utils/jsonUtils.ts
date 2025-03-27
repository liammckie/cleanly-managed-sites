
import { JsonValue } from '@/types/common';

/**
 * Safely converts a string to JSON or returns a default value
 */
export function safeParseJson(jsonString: string | null | undefined, defaultValue: JsonValue = null): JsonValue {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as JsonValue;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Safely stringifies a value to JSON or returns a default value
 */
export function safeStringifyJson(value: any, defaultValue: string = ''): string {
  if (value === undefined || value === null) return defaultValue;
  
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return defaultValue;
  }
}
