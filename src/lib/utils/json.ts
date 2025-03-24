
import { Json } from '../types';

// Helper function to safely access properties from JSON data
export function getJsonProperty<T>(json: Json | undefined, path: string, defaultValue: T): T {
  if (!json) return defaultValue;
  
  // Handle string JSON
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }
  
  // Handle non-object JSON types
  if (typeof json !== 'object' || json === null) {
    return defaultValue;
  }
  
  const parts = path.split('.');
  let current: any = json;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    
    current = current[part];
    
    if (current === undefined) {
      return defaultValue;
    }
  }
  
  return current as T || defaultValue;
}

// Helper function to safely parse a JSON string, with a fallback object
export function safeParseJson(jsonString: string | Json | null | undefined, fallback: any = {}): any {
  if (!jsonString) return fallback;
  
  if (typeof jsonString === 'object') {
    return jsonString;
  }
  
  try {
    return JSON.parse(jsonString as string);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
}

// Helper function to check if a JSON object has a specific property
export function hasJsonProperty(json: Json | undefined, property: string): boolean {
  if (!json) return false;
  
  if (typeof json === 'object' && json !== null) {
    return property in json;
  }
  
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === 'object' && parsed !== null && property in parsed;
    } catch {
      return false;
    }
  }
  
  return false;
}

// Convert JSON to a strongly typed object for better TypeScript support
export function asJsonObject<T>(json: Json | undefined, defaultValue: T): T {
  if (!json) return defaultValue;
  
  if (typeof json === 'string') {
    try {
      return JSON.parse(json) as T;
    } catch {
      return defaultValue;
    }
  }
  
  if (typeof json === 'object' && json !== null) {
    return json as unknown as T;
  }
  
  return defaultValue;
}
