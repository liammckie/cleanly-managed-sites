
import { ContractDetails } from '@/types/contracts';
import { Json } from '@/types/common';

/**
 * Extract contract data from a JSON field
 * @param jsonData JSON data from the database
 * @returns Structured contract details
 */
export function extractContractData(jsonData: Json): ContractDetails | null {
  if (!jsonData) return null;
  
  try {
    // If it's a string, parse it
    const contractData = typeof jsonData === 'string' 
      ? JSON.parse(jsonData) 
      : jsonData;
    
    return {
      id: contractData.id,
      contractNumber: contractData.contractNumber || contractData.contract_number,
      startDate: contractData.startDate || contractData.start_date,
      endDate: contractData.endDate || contractData.end_date,
      autoRenewal: contractData.autoRenewal || contractData.auto_renewal,
      renewalPeriod: contractData.renewalPeriod || contractData.renewal_period,
      renewalNoticeDays: contractData.renewalNoticeDays || contractData.renewal_notice_days,
      noticeUnit: contractData.noticeUnit || contractData.notice_unit,
      terminationPeriod: contractData.terminationPeriod || contractData.termination_period,
      renewalTerms: contractData.renewalTerms || contractData.renewal_terms,
      contractLength: contractData.contractLength || contractData.contract_length,
      contractLengthUnit: contractData.contractLengthUnit || contractData.contract_length_unit,
      serviceFrequency: contractData.serviceFrequency || contractData.service_frequency,
      serviceDeliveryMethod: contractData.serviceDeliveryMethod || contractData.service_delivery_method,
      terms: contractData.terms || [],
      additionalContracts: contractData.additionalContracts || contractData.additional_contracts || [],
      contractType: contractData.contractType || contractData.contract_type,
      value: contractData.value,
      billingCycle: contractData.billingCycle || contractData.billing_cycle,
      notes: contractData.notes,
      type: contractData.type,
      status: contractData.status
    };
  } catch (error) {
    console.error('Error extracting contract data:', error);
    return null;
  }
}

/**
 * Normalize contract data for database storage
 * @param contractDetails Contract details from form
 * @returns Normalized contract data for storage
 */
export function normalizeContractData(contractDetails: ContractDetails): Json {
  if (!contractDetails) return null;
  
  // Convert any nested objects to proper format
  const normalizedDetails = {
    ...contractDetails,
    // Convert string numbers to actual numbers where needed
    renewalNoticeDays: typeof contractDetails.renewalNoticeDays === 'string' 
      ? parseInt(contractDetails.renewalNoticeDays, 10) 
      : contractDetails.renewalNoticeDays,
    contractLength: typeof contractDetails.contractLength === 'string' 
      ? parseInt(contractDetails.contractLength, 10) 
      : contractDetails.contractLength,
    value: typeof contractDetails.value === 'string' 
      ? parseFloat(contractDetails.value) 
      : contractDetails.value,
    // Ensure terms array is properly formatted
    terms: Array.isArray(contractDetails.terms) 
      ? contractDetails.terms.map(term => ({
          ...term,
          autoRenew: Boolean(term.autoRenew)
        })) 
      : []
  };

  return normalizedDetails as Json;
}

/**
 * Get the start date from contract details
 * @param contractDetails Contract details object or JSON
 * @returns Start date string or null if not found
 */
export function getContractStartDate(contractDetails: Json | ContractDetails | null | undefined): string | null {
  if (!contractDetails) return null;
  
  try {
    // If it's a JSON object (from DB)
    if (typeof contractDetails === 'object') {
      return (contractDetails as any).startDate || (contractDetails as any).start_date || null;
    }
    
    // If it's a string (JSON string)
    if (typeof contractDetails === 'string') {
      try {
        const parsed = JSON.parse(contractDetails);
        return parsed.startDate || parsed.start_date || null;
      } catch (e) {
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting contract start date:', error);
    return null;
  }
}

/**
 * Get the end date from contract details
 * @param contractDetails Contract details object or JSON
 * @returns End date string or null if not found
 */
export function getContractEndDate(contractDetails: Json | ContractDetails | null | undefined): string | null {
  if (!contractDetails) return null;
  
  try {
    // If it's a JSON object (from DB)
    if (typeof contractDetails === 'object') {
      return (contractDetails as any).endDate || (contractDetails as any).end_date || null;
    }
    
    // If it's a string (JSON string)
    if (typeof contractDetails === 'string') {
      try {
        const parsed = JSON.parse(contractDetails);
        return parsed.endDate || parsed.end_date || null;
      } catch (e) {
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting contract end date:', error);
    return null;
  }
}

/**
 * Get the contract type from contract details
 * @param contractDetails Contract details object or JSON
 * @returns Contract type string or null if not found
 */
export function getContractType(contractDetails: Json | ContractDetails | null | undefined): string | null {
  if (!contractDetails) return null;
  
  try {
    // If it's a JSON object (from DB)
    if (typeof contractDetails === 'object') {
      return (contractDetails as any).contractType || 
             (contractDetails as any).contract_type || 
             (contractDetails as any).type || 
             'Standard';
    }
    
    // If it's a string (JSON string)
    if (typeof contractDetails === 'string') {
      try {
        const parsed = JSON.parse(contractDetails);
        return parsed.contractType || parsed.contract_type || parsed.type || 'Standard';
      } catch (e) {
        return 'Standard';
      }
    }
    
    return 'Standard';
  } catch (error) {
    console.error('Error getting contract type:', error);
    return 'Standard';
  }
}

/**
 * Get the contract number from contract details
 * @param contractDetails Contract details object or JSON
 * @returns Contract number string or null if not found
 */
export function getContractNumber(contractDetails: Json | ContractDetails | null | undefined): string | null {
  if (!contractDetails) return null;
  
  try {
    // If it's a JSON object (from DB)
    if (typeof contractDetails === 'object') {
      return (contractDetails as any).contractNumber || (contractDetails as any).contract_number || null;
    }
    
    // If it's a string (JSON string)
    if (typeof contractDetails === 'string') {
      try {
        const parsed = JSON.parse(contractDetails);
        return parsed.contractNumber || parsed.contract_number || null;
      } catch (e) {
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting contract number:', error);
    return null;
  }
}

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
