
import { ContractDetails } from '@/types/contracts';
import { Json } from '@/types/common';

/**
 * Get a specific field value from contract details
 * @param contractDetails Contract details object or JSON
 * @param fieldName The field name to retrieve
 * @param defaultValue Default value if field not found
 * @returns Field value or default if not found
 */
export function getContractField<T>(
  contractDetails: Json | ContractDetails | null | undefined,
  fieldName: string,
  defaultValue: T
): T {
  if (!contractDetails) return defaultValue;
  
  try {
    // Convert to object if it's a string
    const details = typeof contractDetails === 'string' 
      ? JSON.parse(contractDetails) 
      : contractDetails;
    
    // Try camelCase and snake_case versions of the field name
    const camelCaseField = fieldName;
    const snakeCaseField = fieldName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Check both possible field name formats
    if (details[camelCaseField] !== undefined) {
      return details[camelCaseField] as unknown as T;
    }
    
    if (details[snakeCaseField] !== undefined) {
      return details[snakeCaseField] as unknown as T;
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Error getting contract field ${fieldName}:`, error);
    return defaultValue;
  }
}

/**
 * Get the contract start date
 * @param contractDetails Contract details
 * @returns Start date or null
 */
export function getContractStartDate(contractDetails: Json | ContractDetails | null | undefined): string | null {
  return getContractField(contractDetails, 'startDate', null);
}

/**
 * Get the contract end date
 * @param contractDetails Contract details
 * @returns End date or null
 */
export function getContractEndDate(contractDetails: Json | ContractDetails | null | undefined): string | null {
  return getContractField(contractDetails, 'endDate', null);
}

/**
 * Get the contract type
 * @param contractDetails Contract details
 * @returns Contract type or 'Standard'
 */
export function getContractType(contractDetails: Json | ContractDetails | null | undefined): string {
  return getContractField(contractDetails, 'contractType', 'Standard');
}

/**
 * Get the contract number
 * @param contractDetails Contract details
 * @returns Contract number or null
 */
export function getContractNumber(contractDetails: Json | ContractDetails | null | undefined): string | null {
  return getContractField(contractDetails, 'contractNumber', null);
}
