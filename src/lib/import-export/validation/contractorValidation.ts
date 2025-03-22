
import { ContractorRecord, ValidationMessage, ValidationResult } from '../types';

export const validateContractorData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<ContractorRecord>[] = [];

  data.forEach((item, index) => {
    const rowNum = index + 1;
    const contractor: Partial<ContractorRecord> = {};
    let hasErrors = false;

    // Required fields
    if (!item.business_name) {
      errors.push({
        row: rowNum,
        field: 'business_name',
        message: 'Business name is required',
        value: item.business_name
      });
      hasErrors = true;
    } else {
      contractor.business_name = item.business_name;
    }

    if (!item.contact_name) {
      errors.push({
        row: rowNum,
        field: 'contact_name',
        message: 'Contact name is required',
        value: item.contact_name
      });
      hasErrors = true;
    } else {
      contractor.contact_name = item.contact_name;
    }

    // Optional fields
    contractor.email = item.email || undefined;
    contractor.phone = item.phone || undefined;
    contractor.address = item.address || undefined;
    contractor.city = item.city || undefined;
    contractor.state = item.state || undefined;
    contractor.postcode = item.postcode || undefined;
    contractor.status = item.status || 'active';
    contractor.notes = item.notes || undefined;
    contractor.custom_id = item.custom_id || undefined;
    
    // Handle services as an array if provided
    if (item.services) {
      try {
        if (typeof item.services === 'string') {
          // Try to parse JSON string
          if (item.services.startsWith('[') && item.services.endsWith(']')) {
            contractor.services = JSON.parse(item.services);
          } else {
            // Comma-separated string
            contractor.services = item.services.split(',').map((s: string) => s.trim());
          }
        } else if (Array.isArray(item.services)) {
          contractor.services = item.services;
        }
      } catch (error) {
        warnings.push({
          row: rowNum,
          field: 'services',
          message: 'Services could not be parsed as an array',
          value: item.services
        });
      }
    }

    if (!hasErrors) {
      validData.push(contractor);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};
