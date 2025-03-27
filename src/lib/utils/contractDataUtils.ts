
import { Json } from '@/types/common';

export function parseContractData(data: string | Json | null): any {
  if (!data) return null;
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing contract data:', error);
    return null;
  }
}

export function formatContractData(data: any): Json {
  if (!data) return null;
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data) as Json;
    }
    
    return data as Json;
  } catch (error) {
    console.error('Error formatting contract data:', error);
    return null;
  }
}

/**
 * Extract contract start date from contract details
 */
export function getContractStartDate(contractDetails: any): string | null {
  if (!contractDetails || typeof contractDetails !== 'object') {
    return null;
  }
  
  return contractDetails.startDate || contractDetails.start_date || null;
}

/**
 * Extract contract end date from contract details
 */
export function getContractEndDate(contractDetails: any): string | null {
  if (!contractDetails || typeof contractDetails !== 'object') {
    return null;
  }
  
  return contractDetails.endDate || contractDetails.end_date || null;
}

/**
 * Extract contract type from contract details
 */
export function getContractType(contractDetails: any): string {
  if (!contractDetails || typeof contractDetails !== 'object') {
    return 'Standard';
  }
  
  return contractDetails.type || contractDetails.contract_type || 'Standard';
}
