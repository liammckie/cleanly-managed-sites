
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export function jsonToString(value: Json | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // Handle arrays and objects
  return JSON.stringify(value);
}

export function asJsonObject<T>(jsonValue: any, defaultValue: T): T {
  if (!jsonValue) {
    return defaultValue;
  }
  
  try {
    // If it's already an object, return it
    if (typeof jsonValue === 'object' && jsonValue !== null) {
      return jsonValue as T;
    }
    
    // If it's a JSON string, parse it
    if (typeof jsonValue === 'string') {
      return JSON.parse(jsonValue) as T;
    }
    
    // Fallback to default
    return defaultValue;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}
