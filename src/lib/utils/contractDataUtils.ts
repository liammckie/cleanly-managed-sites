
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
