
import { Json } from '@/types/common';

/**
 * Safely converts a JSON value to a string
 * @param value The JSON value to convert
 * @returns A string representation of the value, or an empty string if undefined
 */
export function jsonToString(value: any): string {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error('Error converting value to string:', e);
    return '';
  }
}

/**
 * Safely parses a JSON string into an object
 * @param json The JSON string to parse
 * @param defaultValue A default value to return if parsing fails
 * @returns The parsed object or the default value
 */
export function parseJson<T = any>(json: string | null | undefined, defaultValue: T): T {
  if (!json) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

/**
 * Ensures a value is a proper JSON object
 * @param value The value to check and convert if needed
 * @param defaultValue The default value to use if conversion fails
 * @returns A proper JSON object
 */
export function asJsonObject<T = Record<string, any>>(value: any, defaultValue: T): T {
  if (!value) {
    return defaultValue;
  }
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as T;
      }
    } catch (e) {
      console.error('Error parsing JSON string:', e);
    }
  }
  
  return defaultValue;
}

/**
 * Safely stringifies a value to JSON
 * @param value The value to stringify
 * @returns A JSON string or null if stringification fails
 */
export function safeStringify(value: any): string | null {
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error('Error stringifying value:', e);
    return null;
  }
}
