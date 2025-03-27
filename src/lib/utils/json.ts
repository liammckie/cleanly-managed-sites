
import { Json } from '@/lib/types';

/**
 * Check if the value is a valid JSON object
 */
export function isJsonObject(value: any): value is { [key: string]: any } {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Safely access a Json value as a JSON object
 * If the value is not a valid JSON object, returns the default value
 */
export function asJsonObject<T = any>(value: Json | undefined | null, defaultValue: T): T {
  if (!value) return defaultValue;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return isJsonObject(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  return isJsonObject(value) ? value : defaultValue;
}

/**
 * Safely access a property from a Json value
 */
export function getJsonProperty<T = any>(json: Json | undefined | null, key: string, defaultValue: T): T {
  const obj = asJsonObject(json, {});
  return (obj[key] as T) ?? defaultValue;
}

/**
 * Convert an unknown value to a string
 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Convert an unknown value to a number
 */
export function safeNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Convert an unknown value to a boolean
 */
export function safeBoolean(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  return Boolean(value);
}
