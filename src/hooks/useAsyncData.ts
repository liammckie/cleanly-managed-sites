
import { useState, useEffect } from 'react';

/**
 * A utility hook that safely handles and unwraps data from promises or direct values
 * This solves the common error with Promise<T[]> vs T[] type mismatches
 */
export function useAsyncData<T>(dataPromise: Promise<T[]> | T[] | unknown): {
  data: T[];
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Helper to safely handle the data regardless of whether it's a promise or direct value
    const processData = async () => {
      try {
        // Handle if dataPromise is a Promise
        if (dataPromise instanceof Promise) {
          const result = await dataPromise;
          if (isMounted) {
            setData(Array.isArray(result) ? result : []);
            setIsLoading(false);
          }
        } 
        // Handle if dataPromise is already an array
        else if (Array.isArray(dataPromise)) {
          if (isMounted) {
            setData(dataPromise);
            setIsLoading(false);
          }
        } 
        // Handle if it's neither (fallback)
        else {
          if (isMounted) {
            setData([]);
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    processData();

    return () => {
      isMounted = false;
    };
  }, [dataPromise]);

  return { data, isLoading, error };
}

/**
 * Helper function to safely unwrap async data without hooks
 */
export async function unwrapAsyncData<T>(dataPromise: Promise<T[]> | T[] | unknown): Promise<T[]> {
  try {
    if (dataPromise instanceof Promise) {
      const result = await dataPromise;
      return Array.isArray(result) ? result : [];
    } else if (Array.isArray(dataPromise)) {
      return dataPromise;
    }
    return [];
  } catch (error) {
    console.error("Error unwrapping async data:", error);
    return [];
  }
}

/**
 * A utility for handling error objects with safe type checking
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  // Handle potential error objects with message property
  if (error && typeof error === 'object' && 'message' in error && 
      typeof error.message === 'string') {
    return error.message;
  }
  return String(error);
}
