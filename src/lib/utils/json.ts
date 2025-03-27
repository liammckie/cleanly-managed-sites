
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

/**
 * Safely convert any value to a JSON object
 * @param value Any value to convert to a JSON object
 * @returns JSON object or empty object if conversion fails
 */
export function asJsonObject<T>(value: any): T {
  if (!value) return {} as T;
  
  if (typeof value === 'object') {
    return value as T;
  }
  
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return parsed as T;
    }
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
  }
  
  return {} as T;
}

/**
 * Convert JSON to string representation
 * @param data JSON data to stringify
 * @returns String representation of JSON data
 */
export function jsonToString(data: any): string {
  if (!data) return '';
  
  try {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.warn('Failed to stringify JSON:', e);
    return '';
  }
}

/**
 * Deep merge of two objects
 */
export function deepMerge<T>(target: T, source: any): T {
  const result = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(result, { [key]: source[key] });
        } else {
          (result as any)[key] = deepMerge((target as any)[key], source[key]);
        }
      } else {
        Object.assign(result, { [key]: source[key] });
      }
    });
  }
  
  return result;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
