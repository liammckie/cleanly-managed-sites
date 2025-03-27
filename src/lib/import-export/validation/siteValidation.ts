
import { ValidationResult, ValidationMessage } from './types';

/**
 * Validates site data for importing
 * @param siteData The site data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateSiteData(siteData: any[]): ValidationResult {
  const messages: ValidationMessage[] = [];
  let isValid = true;
  
  if (!Array.isArray(siteData)) {
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Site data must be an array'
    });
    return { valid: false, messages };
  }
  
  siteData.forEach((site, index) => {
    // Required fields
    if (!site.name) {
      messages.push({
        type: 'error',
        field: 'name',
        message: `Row ${index + 1}: Site name is required`
      });
      isValid = false;
    }
    
    if (!site.client_id) {
      messages.push({
        type: 'error',
        field: 'client_id',
        message: `Row ${index + 1}: Client ID is required`
      });
      isValid = false;
    }
    
    if (!site.address) {
      messages.push({
        type: 'error',
        field: 'address',
        message: `Row ${index + 1}: Address is required`
      });
      isValid = false;
    }
    
    // Email validation
    if (site.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) {
      messages.push({
        type: 'warning',
        field: 'email',
        message: `Row ${index + 1}: Invalid email format`
      });
    }
    
    // Status validation
    if (site.status && !['active', 'pending', 'inactive', 'lost', 'on-hold'].includes(site.status)) {
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status, will default to 'active'`
      });
    }
    
    // Revenue validation
    if (site.monthly_revenue && (isNaN(Number(site.monthly_revenue)) || Number(site.monthly_revenue) < 0)) {
      messages.push({
        type: 'warning',
        field: 'monthly_revenue',
        message: `Row ${index + 1}: Monthly revenue must be a positive number`
      });
    }
    
    // State validation for Australia
    if (site.state && !['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].includes(site.state)) {
      messages.push({
        type: 'warning',
        field: 'state',
        message: `Row ${index + 1}: State '${site.state}' is not a valid Australian state abbreviation`
      });
    }
    
    // Postcode validation for Australia
    if (site.postcode && !/^\d{4}$/.test(site.postcode)) {
      messages.push({
        type: 'warning',
        field: 'postcode',
        message: `Row ${index + 1}: Australian postcodes should be 4 digits`
      });
    }
  });
  
  return { valid: isValid, messages };
}
