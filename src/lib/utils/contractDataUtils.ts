
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { format, parseISO } from 'date-fns';

/**
 * Extracts contract data from JSON format for API usage
 * @param contractData Contract data from API (possibly as JSON)
 * @returns Properly formatted ContractDetails object
 */
export function extractContractData(contractData: any): ContractDetails | null {
  if (!contractData) return null;
  
  try {
    // If it's a string, try to parse it
    if (typeof contractData === 'string') {
      try {
        contractData = JSON.parse(contractData);
      } catch (e) {
        console.error('Error parsing contract data string:', e);
      }
    }
    
    return {
      id: contractData.id,
      contractNumber: contractData.contractNumber || contractData.contract_number,
      type: contractData.type,
      status: contractData.status,
      startDate: contractData.startDate || contractData.start_date,
      endDate: contractData.endDate || contractData.end_date,
      autoRenewal: contractData.autoRenewal || contractData.auto_renewal,
      renewalNoticeDays: contractData.renewalNoticeDays || contractData.renewal_notice_days,
      renewalLengthMonths: contractData.renewalLengthMonths || contractData.renewal_length_months,
      reviewDate: contractData.reviewDate || contractData.review_date,
      annualValue: contractData.annualValue || contractData.annual_value,
      terminationClause: contractData.terminationClause || contractData.termination_clause,
      noticePeriodDays: contractData.noticePeriodDays || contractData.notice_period_days,
      nextIncreaseDate: contractData.nextIncreaseDate || contractData.next_increase_date,
      specialTerms: contractData.specialTerms || contractData.special_terms,
      value: contractData.value,
      billingCycle: contractData.billingCycle || contractData.billing_cycle,
      contractType: contractData.contractType || contractData.contract_type,
      terminationPeriod: contractData.terminationPeriod || contractData.termination_period,
      renewalTerms: contractData.renewalTerms || contractData.renewal_terms,
      contractLength: contractData.contractLength || contractData.contract_length,
      contractLengthUnit: contractData.contractLengthUnit || contractData.contract_length_unit,
      renewalPeriod: contractData.renewalPeriod || contractData.renewal_period,
      renewalNotice: contractData.renewalNotice || contractData.renewal_notice,
      noticeUnit: contractData.noticeUnit || contractData.notice_unit,
      serviceFrequency: contractData.serviceFrequency || contractData.service_frequency,
      serviceDeliveryMethod: contractData.serviceDeliveryMethod || contractData.service_delivery_method,
      notes: contractData.notes
    };
  } catch (error) {
    console.error('Error extracting contract data:', error);
    return null;
  }
}

/**
 * Formats a contract for display purposes
 * @param contract The contract details to format
 * @returns Formatted contract information as a string
 */
export function formatContractForDisplay(contract: ContractDetails | null): string {
  if (!contract) return 'No contract information';
  
  const parts = [];
  
  if (contract.contractNumber) {
    parts.push(`Contract #${contract.contractNumber}`);
  }
  
  if (contract.startDate && contract.endDate) {
    try {
      const formattedStart = format(parseISO(contract.startDate), 'dd/MM/yyyy');
      const formattedEnd = format(parseISO(contract.endDate), 'dd/MM/yyyy');
      parts.push(`${formattedStart} - ${formattedEnd}`);
    } catch (e) {
      // Skip date formatting if dates are invalid
    }
  }
  
  if (contract.value) {
    parts.push(`$${contract.value.toLocaleString()}`);
    
    if (contract.billingCycle) {
      parts[parts.length - 1] += ` per ${contract.billingCycle}`;
    }
  }
  
  if (contract.status) {
    parts.push(`Status: ${contract.status}`);
  }
  
  return parts.join(' | ');
}

/**
 * Normalizes the contract data to ensure consistency
 * @param contractData Raw contract data
 * @returns Normalized contract data
 */
export function normalizeContractData(contractData: any): ContractDetails {
  if (!contractData) return {} as ContractDetails;
  
  const normalized: ContractDetails = { ...contractData };
  
  // Convert any number fields stored as strings to numbers
  if (typeof normalized.renewalPeriod === 'string') {
    normalized.renewalPeriod = parseInt(normalized.renewalPeriod, 10) || undefined;
  }
  
  if (typeof normalized.renewalNoticeDays === 'string') {
    normalized.renewalNoticeDays = parseInt(normalized.renewalNoticeDays, 10) || undefined;
  }
  
  if (typeof normalized.contractLength === 'string') {
    normalized.contractLength = parseInt(normalized.contractLength, 10) || undefined;
  }
  
  if (typeof normalized.value === 'string') {
    normalized.value = parseFloat(normalized.value) || undefined;
  }
  
  // Ensure boolean fields are actual booleans
  normalized.autoRenewal = !!normalized.autoRenewal;
  
  return normalized;
}

/**
 * Gets the start date from contract details
 * @param contractDetails Contract details object or JSON
 * @returns Start date string or null if not found
 */
export function getContractStartDate(contractDetails: any): string | null {
  if (!contractDetails) return null;
  
  try {
    // If contractDetails is a string (JSON), parse it
    const details = typeof contractDetails === 'string' 
      ? JSON.parse(contractDetails) 
      : contractDetails;
    
    return details.startDate || details.start_date || null;
  } catch (error) {
    console.error('Error getting contract start date:', error);
    return null;
  }
}

/**
 * Gets the end date from contract details
 * @param contractDetails Contract details object or JSON
 * @returns End date string or null if not found
 */
export function getContractEndDate(contractDetails: any): string | null {
  if (!contractDetails) return null;
  
  try {
    // If contractDetails is a string (JSON), parse it
    const details = typeof contractDetails === 'string' 
      ? JSON.parse(contractDetails) 
      : contractDetails;
    
    return details.endDate || details.end_date || null;
  } catch (error) {
    console.error('Error getting contract end date:', error);
    return null;
  }
}

/**
 * Gets the contract type from contract details
 * @param contractDetails Contract details object or JSON
 * @returns Contract type string or default value if not found
 */
export function getContractType(contractDetails: any): string {
  if (!contractDetails) return 'Standard';
  
  try {
    // If contractDetails is a string (JSON), parse it
    const details = typeof contractDetails === 'string' 
      ? JSON.parse(contractDetails) 
      : contractDetails;
    
    return details.contractType || details.contract_type || 'Standard';
  } catch (error) {
    console.error('Error getting contract type:', error);
    return 'Standard';
  }
}
