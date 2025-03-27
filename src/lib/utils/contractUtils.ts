
import { JsonValue } from '@/types/common';

/**
 * Safely extract a value from a potentially undefined JSON object
 */
export function extractJsonValue<T>(json: JsonValue | undefined, path: string, defaultValue: T): T {
  if (!json || typeof json !== 'object' || json === null) {
    return defaultValue;
  }
  
  const keys = path.split('.');
  let current: any = json;
  
  for (const key of keys) {
    if (current === null || typeof current !== 'object' || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return (current as unknown as T) ?? defaultValue;
}

/**
 * Format a contract value for display
 */
export function formatContractValue(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(value);
}
