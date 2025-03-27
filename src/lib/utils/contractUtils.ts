
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

/**
 * Get a field from contract details with proper type handling
 * @param contractDetails Contract details object which could be undefined or null
 * @param fieldName The name of the field to extract
 * @param defaultValue Default value to return if the field doesn't exist
 */
export function getContractField<T>(contractDetails: any, fieldName: string, defaultValue: T): T {
  if (!contractDetails || typeof contractDetails !== 'object') {
    return defaultValue;
  }
  
  return (contractDetails[fieldName] as T) ?? defaultValue;
}

/**
 * Check if a contract is expiring soon within the specified number of days
 * @param contractDetails Contract details object
 * @param days Number of days to check
 * @returns Boolean indicating if the contract is expiring soon
 */
export function isContractExpiringSoon(contractDetails: any, days: number = 30): boolean {
  if (!contractDetails || typeof contractDetails !== 'object') {
    return false;
  }
  
  const endDate = getContractField(contractDetails, 'endDate', null);
  if (!endDate) {
    return false;
  }
  
  const endDateObj = new Date(endDate);
  const today = new Date();
  const diffTime = endDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= days;
}
