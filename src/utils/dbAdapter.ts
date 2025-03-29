
/**
 * Convert object keys from snake_case to camelCase
 * @param obj The object to convert
 * @returns A new object with camelCase keys
 */
export function snakeToCamel(obj: Record<string, any> | null | undefined): Record<string, any> | null {
  if (!obj) return null;
  
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Handle nested objects and arrays
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[camelKey] = value.map(item => 
          typeof item === 'object' && item !== null ? snakeToCamel(item) : item
        );
      } else {
        result[camelKey] = snakeToCamel(value);
      }
    } else {
      result[camelKey] = value;
    }
  });
  
  return result;
}

/**
 * Convert object keys from camelCase to snake_case
 * @param obj The object to convert
 * @returns A new object with snake_case keys
 */
export function camelToSnake(obj: Record<string, any> | null | undefined): Record<string, any> | null {
  if (!obj) return null;
  
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Handle nested objects and arrays
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[snakeKey] = value.map(item => 
          typeof item === 'object' && item !== null ? camelToSnake(item) : item
        );
      } else {
        result[snakeKey] = camelToSnake(value);
      }
    } else {
      result[snakeKey] = value;
    }
  });
  
  return result;
}

/**
 * Create an adapter function that converts data to the appropriate format
 * @param transformFn The transformation function to use
 * @returns An adapter function that can be applied to data
 */
export function createAdapter<T, U>(transformFn: (data: T) => U) {
  return {
    one: (data: T): U => transformFn(data),
    many: (data: T[]): U[] => data.map(transformFn)
  };
}

/**
 * Create a simple adapter that converts between snake_case and camelCase
 * @param modelName The name of the model being adapted
 * @returns An object with toDb and fromDb functions
 */
export function createCaseAdapter<T extends Record<string, any>, U extends Record<string, any>>(modelName: string) {
  return {
    toDb: (data: T): U => camelToSnake(data) as U,
    fromDb: (data: U): T => snakeToCamel(data) as T,
    
    // Helper methods for multiple items
    manyToDb: (data: T[]): U[] => data.map(item => camelToSnake(item) as U),
    manyFromDb: (data: U[]): T[] => data.map(item => snakeToCamel(item) as T),
    
    // Add model name for debugging
    modelName
  };
}
