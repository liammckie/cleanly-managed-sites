
/**
 * Adapter utility functions
 */

/**
 * Convert string from snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert string from camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert all keys in an object from snake_case to camelCase (deep)
 */
export function snakeToCamelObject<T extends Record<string, any> | null | undefined>(
  obj: T
): Record<string, any> | null {
  if (!obj) return null;
  
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    const camelKey = snakeToCamel(key);
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[camelKey] = value.map(item => 
          typeof item === 'object' && item !== null ? snakeToCamelObject(item) : item
        );
      } else {
        result[camelKey] = snakeToCamelObject(value);
      }
    } else {
      result[camelKey] = value;
    }
  });
  
  return result;
}

/**
 * Convert all keys in an object from camelCase to snake_case (deep)
 */
export function camelToSnakeObject<T extends Record<string, any> | null | undefined>(
  obj: T
): Record<string, any> | null {
  if (!obj) return null;
  
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    const snakeKey = camelToSnake(key);
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[snakeKey] = value.map(item => 
          typeof item === 'object' && item !== null ? camelToSnakeObject(item) : item
        );
      } else {
        result[snakeKey] = camelToSnakeObject(value);
      }
    } else {
      result[snakeKey] = value;
    }
  });
  
  return result;
}
