
import { Json } from '@/types/common';

/**
 * Extract contract details from a JSON object with proper type casting
 */
export function getContractDetail<T extends keyof any>(contractDetails: Json | null | undefined, field: T): any {
  if (!contractDetails) {
    return undefined;
  }
  
  if (typeof contractDetails === 'object' && !Array.isArray(contractDetails)) {
    // @ts-ignore - This is a safe access with proper null checking
    return contractDetails[field];
  }
  
  return undefined;
}

/**
 * Get contract start date string
 */
export function getContractStartDate(contractDetails: Json | null | undefined): string | undefined {
  return getContractDetail(contractDetails, 'startDate');
}

/**
 * Get contract end date string
 */
export function getContractEndDate(contractDetails: Json | null | undefined): string | undefined {
  return getContractDetail(contractDetails, 'endDate');
}

/**
 * Get contract type
 */
export function getContractType(contractDetails: Json | null | undefined): string | undefined {
  return getContractDetail(contractDetails, 'contractType');
}
