
import { ValidationResult, ValidationMessage } from './types';

/**
 * Validates contractor data for importing
 * @param contractorData The contractor data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateContractorData(contractorData: any[]): ValidationResult {
  const messages: ValidationMessage[] = [];
  let isValid = true;
  
  if (!Array.isArray(contractorData)) {
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Contractor data must be an array'
    });
    return { valid: false, messages };
  }
  
  contractorData.forEach((contractor, index) => {
    // Required fields
    if (!contractor.business_name) {
      messages.push({
        type: 'error',
        field: 'business_name',
        message: `Row ${index + 1}: Business name is required`
      });
      isValid = false;
    }
    
    if (!contractor.contact_name) {
      messages.push({
        type: 'error',
        field: 'contact_name',
        message: `Row ${index + 1}: Contact name is required`
      });
      isValid = false;
    }
    
    // Email validation
    if (contractor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contractor.email)) {
      messages.push({
        type: 'error',
        field: 'email',
        message: `Row ${index + 1}: Invalid email format`
      });
      isValid = false;
    }
    
    // Phone format validation
    if (contractor.phone && !/^\+?[0-9\s()-]{8,}$/.test(contractor.phone)) {
      messages.push({
        type: 'warning',
        field: 'phone',
        message: `Row ${index + 1}: Phone number format may be invalid`
      });
    }
    
    // ABN validation
    if (contractor.abn && !/^\d{11}$/.test(contractor.abn.replace(/\s/g, ''))) {
      messages.push({
        type: 'warning',
        field: 'abn',
        message: `Row ${index + 1}: ABN format may be invalid`
      });
    }
    
    // Status validation
    if (contractor.status && !['active', 'inactive', 'pending'].includes(contractor.status)) {
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status, will default to 'active'`
      });
    }
    
    // Rate validation
    if (contractor.hourly_rate && (isNaN(Number(contractor.hourly_rate)) || Number(contractor.hourly_rate) < 0)) {
      messages.push({
        type: 'error',
        field: 'hourly_rate',
        message: `Row ${index + 1}: Hourly rate must be a positive number`
      });
      isValid = false;
    }
  });
  
  return { valid: isValid, messages };
}
