
import { EmploymentType } from '@/types/common';

export function adaptEmploymentType(type: string): EmploymentType {
  switch (type) {
    case 'full-time':
    case 'fullTime':
    case 'full_time':
      return 'full-time';
    case 'part-time':
    case 'partTime':
    case 'part_time':
      return 'part-time';
    case 'casual':
      return 'casual';
    default:
      return 'casual'; // Default fallback
  }
}

export function stringToAddressObject(address: string) {
  // Simple parsing of address string into components
  const parts = address.split(',').map(part => part.trim());
  
  if (parts.length === 0) {
    return { street: '', city: '', state: '', postcode: '' };
  }
  
  if (parts.length === 1) {
    return { street: parts[0], city: '', state: '', postcode: '' };
  }
  
  // Last part might contain state and postcode
  let state = '';
  let postcode = '';
  
  if (parts.length > 2) {
    const lastPart = parts[parts.length - 1];
    const match = lastPart.match(/([A-Z]{2,3})\s+(\d{4})/);
    
    if (match) {
      state = match[1];
      postcode = match[2];
      parts.pop(); // Remove the last part that we've extracted
    }
  }
  
  return {
    street: parts[0] || '',
    city: parts.length > 1 ? parts[1] : '',
    state,
    postcode
  };
}
