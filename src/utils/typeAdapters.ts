
import { EmploymentType, ServiceDeliveryType } from '@/types/common';
import { ContractDetails } from '@/types/contracts';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';

/**
 * Converts a contract details object from form format to API format
 * @param contractDetails Contract details from form
 * @returns Contract details formatted for API
 */
export function adaptContractDetailsToApi(contractDetails: ContractDetails): any {
  if (!contractDetails) return null;
  
  return {
    ...contractDetails,
    // Convert numeric values to strings if needed by API
    renewalPeriod: contractDetails.renewalPeriod ? String(contractDetails.renewalPeriod) : undefined,
    renewalNoticeDays: contractDetails.renewalNoticeDays ? String(contractDetails.renewalNoticeDays) : undefined,
    contractLength: contractDetails.contractLength ? String(contractDetails.contractLength) : undefined,
  };
}

/**
 * Converts billing details from form format to DTO format
 * @param billingDetails Billing details from form
 * @returns Billing details formatted for DTO
 */
export function adaptBillingDetailsToDTO(billingDetails: BillingDetails): any {
  if (!billingDetails) return null;
  
  return {
    ...billingDetails,
    // Ensure serviceDeliveryType is one of the allowed values
    serviceDeliveryType: billingDetails.serviceDeliveryType === 'mixed' 
      ? 'direct' as ServiceDeliveryType 
      : billingDetails.serviceDeliveryType
  };
}

/**
 * Adapts an address object for consistent structure
 * @param address Address object to adapt
 * @returns Properly structured address
 */
export function adaptAddress(address: any): any {
  if (!address) return null;
  
  return {
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    postcode: address.postcode || '',
    country: address.country || 'Australia'
  };
}

/**
 * Converts employment type string to enum value
 * @param type Employment type string
 * @returns Valid employment type enum value
 */
export function adaptEmploymentType(type: string): EmploymentType {
  if (type === 'full_time') return 'full-time';
  if (type === 'part_time') return 'part-time';
  return type as EmploymentType;
}

/**
 * Converts a billingAddress string to an object
 * @param addressString Address string to convert
 * @returns Address object
 */
export function stringToAddressObject(addressString: string): any {
  if (!addressString) return null;
  
  // If it's already an object, return it
  if (typeof addressString !== 'string') return addressString;
  
  // Create default address object
  return {
    street: addressString,
    city: '',
    state: '',
    postcode: '',
    country: 'Australia'
  };
}
