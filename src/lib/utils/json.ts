
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
  
  // Handle string JSON
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch {
      return false;
    }
  }
  
  // Handle non-object JSON types
  if (typeof json !== 'object' || json === null) {
    return false;
  }
  
  return property in json;
}

// Helper function to safely cast Json to an object type
export function asJsonObject<T>(json: Json | undefined, defaultValue: T): T {
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
  
  return json as T;
}
