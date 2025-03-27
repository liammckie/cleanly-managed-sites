
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Helper function to safely access JSON properties, assuming a given structure
 */
export function jsonObjectGet<T>(jsonValue: Json | undefined, path: string, defaultValue: T): T {
  if (!jsonValue || typeof jsonValue !== 'object' || Array.isArray(jsonValue)) {
    return defaultValue;
  }
  
  const pathParts = path.split('.');
  let current: any = jsonValue;
  
  for (const part of pathParts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Safely converts a JSON value to a string
 */
export function jsonToString(value: Json | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Tries to parse a JSON string into an object, returns a default if parsing fails
 */
export function parseJson<T>(jsonString: string | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return defaultValue;
  }
}

/**
 * Safely access a JSON object, returning the default if the value is not an object
 */
export function asJsonObject<T>(json: Json | undefined, defaultValue: T): T {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return defaultValue;
  }
  return json as unknown as T;
}
