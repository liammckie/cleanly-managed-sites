
import { ValidationResult, ValidationMessage, ValidationError } from '../types';
import { ContractorRecord } from '../types';

/**
 * Validates contractor data for importing
 * @param contractorData The contractor data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateContractorData(contractorData: any[]): ValidationResult<Partial<ContractorRecord>[]> {
  const messages: ValidationMessage[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let valid = true;
  
  if (!Array.isArray(contractorData)) {
    const error = {
      path: 'data',
      message: 'Contractor data must be an array'
    };
    errors.push(error);
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Contractor data must be an array'
    });
    return { valid: false, errors, warnings, messages };
  }
  
  const validData: Partial<ContractorRecord>[] = [];
  
  contractorData.forEach((contractor, index) => {
    const validContractor: Partial<ContractorRecord> = {};
    
    // Required fields
    if (!contractor.business_name) {
      valid = false;
      const error = {
        path: `[${index}].business_name`,
        message: `Row ${index + 1}: Business name is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'business_name',
        message: `Row ${index + 1}: Business name is required`
      });
    } else {
      validContractor.business_name = contractor.business_name;
    }
    
    if (!contractor.contact_name) {
      valid = false;
      const error = {
        path: `[${index}].contact_name`,
        message: `Row ${index + 1}: Contact name is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'contact_name',
        message: `Row ${index + 1}: Contact name is required`
      });
    } else {
      validContractor.contact_name = contractor.contact_name;
    }
    
    if (!contractor.contractor_type) {
      valid = false;
      const error = {
        path: `[${index}].contractor_type`,
        message: `Row ${index + 1}: Contractor type is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'contractor_type',
        message: `Row ${index + 1}: Contractor type is required`
      });
    } else {
      validContractor.contractor_type = contractor.contractor_type;
    }
    
    // Email validation
    if (contractor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contractor.email)) {
      valid = false;
      const error = {
        path: `[${index}].email`,
        message: `Row ${index + 1}: Invalid email format`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'email',
        message: `Row ${index + 1}: Invalid email format`
      });
    } else {
      validContractor.email = contractor.email;
    }
    
    // Copy other fields
    validContractor.id = contractor.id;
    validContractor.phone = contractor.phone;
    validContractor.address = contractor.address;
    validContractor.city = contractor.city;
    validContractor.state = contractor.state;
    validContractor.postcode = contractor.postcode;
    validContractor.abn = contractor.abn;
    validContractor.status = contractor.status || 'active';
    validContractor.specialty = Array.isArray(contractor.specialty) ? contractor.specialty : 
      (contractor.specialty ? [contractor.specialty] : undefined);
    validContractor.notes = contractor.notes;
    
    // Add to valid data if all required fields are present
    if (validContractor.business_name && validContractor.contact_name && validContractor.contractor_type) {
      validData.push(validContractor);
    }
  });
  
  return { valid, data: validData, errors, warnings, messages };
}
