
import { JsonValue } from "@/types/common";

/**
 * Safely access contract details fields from a JSON object
 */
export const getContractField = <T>(contractDetails: JsonValue | undefined | null, field: string, defaultValue: T): T => {
  if (!contractDetails) return defaultValue;
  
  try {
    if (typeof contractDetails === 'object' && contractDetails !== null && !Array.isArray(contractDetails)) {
      const details = contractDetails as Record<string, any>;
      return (details[field] !== undefined && details[field] !== null) ? details[field] : defaultValue;
    }
  } catch (error) {
    console.error(`Error accessing contract field ${field}:`, error);
  }
  
  return defaultValue;
};

/**
 * Safely check if a contract is expiring soon
 */
export const isContractExpiringSoon = (contractDetails: JsonValue | undefined | null, daysThreshold: number = 60): boolean => {
  if (!contractDetails) return false;
  
  try {
    const endDateStr = getContractField(contractDetails, 'endDate', '');
    if (!endDateStr) return false;
    
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= daysThreshold;
  } catch (error) {
    console.error('Error checking contract expiration:', error);
    return false;
  }
};
