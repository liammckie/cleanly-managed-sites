
import { Json } from '@/lib/types';
import { QuoteStatus } from '@/lib/types/award/types';

/**
 * Type guard to ensure a string value is a valid QuoteStatus
 */
export function isValidQuoteStatus(status: string): status is QuoteStatus {
  return ['draft', 'sent', 'approved', 'rejected', 'expired', 'pending', 'accepted'].includes(status);
}

/**
 * Safely converts a string to a QuoteStatus, defaulting to 'draft' if invalid
 */
export function toQuoteStatus(status: string): QuoteStatus {
  return isValidQuoteStatus(status) ? status : 'draft';
}

/**
 * Safely converts a possibly null or undefined JSON value to a string
 */
export function jsonToString(value: Json | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
}

/**
 * Safely converts a possibly null or undefined JSON value to a number
 */
export function jsonToNumber(value: Json | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Safely converts a possibly null or undefined JSON value to a boolean
 */
export function jsonToBoolean(value: Json | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return false;
}
