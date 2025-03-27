
import { ValidationResult, ValidationMessage, ValidationError } from '../types';
import { SiteRecord } from '@/lib/types';

/**
 * Validates site data for importing
 * @param siteData The site data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateSiteData(siteData: any[]): ValidationResult<Partial<SiteRecord>[]> {
  const messages: ValidationMessage[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let valid = true;
  
  if (!Array.isArray(siteData)) {
    const error = {
      path: 'data',
      message: 'Site data must be an array'
    };
    errors.push(error);
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Site data must be an array'
    });
    return { valid: false, errors, warnings, messages };
  }
  
  const validData: Partial<SiteRecord>[] = [];
  
  siteData.forEach((site, index) => {
    const validSite: Partial<SiteRecord> = {};
    
    // Required fields
    if (!site.name) {
      valid = false;
      const error = {
        path: `[${index}].name`,
        message: `Row ${index + 1}: Site name is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'name',
        message: `Row ${index + 1}: Site name is required`
      });
    } else {
      validSite.name = site.name;
    }
    
    if (!site.client_id) {
      valid = false;
      const error = {
        path: `[${index}].client_id`,
        message: `Row ${index + 1}: Client ID is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'client_id',
        message: `Row ${index + 1}: Client ID is required`
      });
    } else {
      validSite.client_id = site.client_id;
    }
    
    if (!site.address) {
      valid = false;
      const error = {
        path: `[${index}].address`,
        message: `Row ${index + 1}: Address is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'address',
        message: `Row ${index + 1}: Address is required`
      });
    } else {
      validSite.address = site.address;
    }
    
    // Email validation
    if (site.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) {
      const warning = {
        path: `[${index}].email`,
        message: `Row ${index + 1}: Invalid email format`
      };
      warnings.push(warning);
      messages.push({
        type: 'warning',
        field: 'email',
        message: `Row ${index + 1}: Invalid email format`
      });
    } else {
      validSite.email = site.email;
    }
    
    // Status validation
    if (site.status && !['active', 'pending', 'inactive', 'lost', 'on-hold'].includes(site.status)) {
      const warning = {
        path: `[${index}].status`,
        message: `Row ${index + 1}: Invalid status, will default to 'active'`
      };
      warnings.push(warning);
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status, will default to 'active'`
      });
      validSite.status = 'active';
    } else {
      validSite.status = site.status || 'active';
    }
    
    // Copy other fields
    validSite.city = site.city;
    validSite.state = site.state;
    validSite.postcode = site.postcode;
    validSite.phone = site.phone;
    validSite.representative = site.representative;
    validSite.notes = site.notes;
    validSite.monthly_revenue = site.monthly_revenue ? Number(site.monthly_revenue) : undefined;
    
    // Add to valid data if all required fields are present
    if (validSite.name && validSite.client_id && validSite.address) {
      validData.push(validSite);
    }
  });
  
  return { valid, data: validData, errors, warnings, messages };
}
