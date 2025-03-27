import { EnhancedValidationResult, ValidationMessage } from '@/types/common';
import { validateClients } from './validation/clientValidation';
import { validateSites } from './validation/siteValidation';
import { validateContracts } from './validation/contractValidation';
import { validateContractors } from './validation/contractorValidation';
import { validateInvoices } from './validation/invoiceValidation';

// When returning validation results, ensure they have the right format:
export function validateClientImport(clients: any[]): EnhancedValidationResult {
  // Perform validation
  const validationResult = validateClients(clients);
  
  // Ensure that the structure matches EnhancedValidationResult
  const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: clients,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

export function validateSiteImport(sites: any[]): EnhancedValidationResult {
  // Perform validation
  const validationResult = validateSites(sites);
  
  // Ensure that the structure matches EnhancedValidationResult
  const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: sites,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

export function validateContractImport(contracts: any[]): EnhancedValidationResult {
  const validationResult = validateContracts(contracts);
  
  const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: contracts,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

export function validateContractorImport(contractors: any[]): EnhancedValidationResult {
  const validationResult = validateContractors(contractors);
  
   const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: contractors,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

export function validateInvoiceImport(invoices: any[]): EnhancedValidationResult {
  const validationResult = validateInvoices(invoices);
  
  const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: invoices,
    warnings: validationResult.warnings || []
  };
  
  return result;
}
