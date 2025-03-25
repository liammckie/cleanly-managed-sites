
/**
 * Safely unwraps a Promise or array value
 * This helps avoid TypeScript errors when dealing with values that might be Promises or actual arrays
 */
export async function ensureArray<T>(value: T[] | Promise<T[]>): Promise<T[]> {
  if (value instanceof Promise) {
    return await value;
  }
  return value;
}

/**
 * Checks if a value is a Promise
 */
export function isPromise<T>(value: any): value is Promise<T> {
  return value instanceof Promise;
}

/**
 * Wraps an API function to always return a resolved Promise with data
 * Useful for components expecting data that might be a Promise
 */
export async function resolveData<T>(dataOrPromise: T | Promise<T>): Promise<T> {
  if (dataOrPromise instanceof Promise) {
    return await dataOrPromise;
  }
  return dataOrPromise;
}

/**
 * Helper to safely filter arrays that might be promises
 */
export async function safeFilter<T>(
  array: T[] | Promise<T[]>,
  predicate: (value: T) => boolean
): Promise<T[]> {
  const resolvedArray = await ensureArray(array);
  return resolvedArray.filter(predicate);
}

/**
 * Helper to safely map arrays that might be promises
 */
export async function safeMap<T, R>(
  array: T[] | Promise<T[]>,
  mapper: (value: T) => R
): Promise<R[]> {
  const resolvedArray = await ensureArray(array);
  return resolvedArray.map(mapper);
}

/**
 * Helper to safely find items in arrays that might be promises
 */
export async function safeFind<T>(
  array: T[] | Promise<T[]>,
  predicate: (value: T) => boolean
): Promise<T | undefined> {
  const resolvedArray = await ensureArray(array);
  return resolvedArray.find(predicate);
}
