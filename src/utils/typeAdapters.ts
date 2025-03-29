
import { EmploymentType } from '@/types/common';

/**
 * Converts a string address to an address object
 */
export function stringToAddressObject(address: string = '') {
  // Simple implementation - in real app would use a proper address parser
  return {
    street: address,
    city: '',
    state: '',
    postcode: '',
    country: 'Australia'
  };
}

/**
 * Adapts employment type from API to internal format
 */
export function adaptEmploymentType(apiValue: string): EmploymentType {
  switch (apiValue) {
    case 'full_time':
    case 'full-time':
      return 'full-time';
    case 'part_time':
    case 'part-time':
      return 'part-time';
    case 'casual':
      return 'casual';
    case 'contract':
      return 'contract';
    case 'intern':
      return 'intern';
    default:
      return 'casual'; // Default value
  }
}
