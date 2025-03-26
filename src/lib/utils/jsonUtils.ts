
import { JsonValue } from "@/types/common";

/**
 * Safely convert a value to a JSON-compatible value
 */
export const toJsonValue = (value: any): JsonValue => {
  if (value === null || value === undefined) return null;
  
  // Handle primitive types
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => toJsonValue(item));
  }
  
  // Handle objects
  if (typeof value === 'object') {
    const result: Record<string, JsonValue> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = toJsonValue(val);
    }
    return result;
  }
  
  // Default fallback
  return JSON.parse(JSON.stringify(value));
};

/**
 * Safely parse a JSON value
 */
export const parseJsonValue = (json: string | null | undefined): JsonValue => {
  if (!json) return null;
  
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};
