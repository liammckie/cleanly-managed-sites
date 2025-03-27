
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { differenceInMonths, parseISO, isAfter, isBefore, addMonths } from 'date-fns';

/**
 * Checks if a contract is expiring soon (within the next 30 days)
 * @param contract The contract details to check
 * @param daysThreshold Number of days to consider as "soon" (default: 30)
 * @returns Boolean indicating if the contract is expiring soon
 */
export function isContractExpiringSoon(contract: ContractDetails | null | undefined, daysThreshold = 30): boolean {
  if (!contract || !contract.endDate) return false;

  try {
    const endDate = parseISO(contract.endDate);
    const now = new Date();
    const thresholdDate = addMonths(now, 1); // Default to 30 days
    
    return isAfter(endDate, now) && isBefore(endDate, thresholdDate);
  } catch (error) {
    console.error('Error checking if contract is expiring soon:', error);
    return false;
  }
}

/**
 * Gets the value of a specific field from contract details
 * @param contract The contract details object
 * @param field The field name to retrieve
 * @param defaultValue Default value to return if the field is not found
 * @returns The field value or default value
 */
export function getContractField<T>(
  contract: ContractDetails | null | undefined, 
  field: keyof ContractDetails, 
  defaultValue: T
): T {
  if (!contract || contract[field] === undefined || contract[field] === null) {
    return defaultValue;
  }
  
  return contract[field] as unknown as T;
}

/**
 * Calculates the remaining months in a contract
 * @param contract The contract details
 * @returns Number of months remaining (negative if expired)
 */
export function getRemainingMonths(contract: ContractDetails | null | undefined): number {
  if (!contract || !contract.endDate) return 0;
  
  try {
    const endDate = parseISO(contract.endDate);
    const now = new Date();
    
    return differenceInMonths(endDate, now);
  } catch (error) {
    console.error('Error calculating remaining months:', error);
    return 0;
  }
}

/**
 * Formats a date string to a readable format
 * @param dateString The date string to format
 * @param format The format to use (default: 'dd/MM/yyyy')
 * @returns Formatted date string or empty string if invalid
 */
export function formatContractDate(dateString: string | undefined, format = 'dd/MM/yyyy'): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting contract date:', error);
    return '';
  }
}

/**
 * Checks if a contract has expired
 * @param contract The contract details to check
 * @returns Boolean indicating if the contract has expired
 */
export function isContractExpired(contract: ContractDetails | null | undefined): boolean {
  if (!contract || !contract.endDate) return false;
  
  try {
    const endDate = parseISO(contract.endDate);
    const now = new Date();
    
    return isBefore(endDate, now);
  } catch (error) {
    console.error('Error checking if contract has expired:', error);
    return false;
  }
}
