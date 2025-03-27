
import { EnhancedValidationResult, ValidationMessage } from '@/types/common';
import { validateClientData } from './validation/clientValidation';
import { validateSiteData } from './validation/siteValidation';
import { validateContractData } from './validation/contractValidation';
import { validateContractorData } from './validation/contractorValidation';
import { validateInvoiceData } from './validation/invoiceValidation';

// When returning validation results, ensure they have the right format:
export function validateClientImport(clients: any[]): EnhancedValidationResult {
  // Perform validation
  const validationResult = validateClientData(clients);
  
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
  const validationResult = validateSiteData(sites);
  
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
  const validationResult = validateContractData(contracts);
  
  const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: contracts,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

export function validateContractorImport(contractors: any[]): EnhancedValidationResult {
  const validationResult = validateContractorData(contractors);
  
   const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: contractors,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

export function validateInvoiceImport(invoices: any[]): EnhancedValidationResult {
  const validationResult = validateInvoiceData(invoices);
  
  const result: EnhancedValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: invoices,
    warnings: validationResult.warnings || []
  };
  
  return result;
}

// Re-export functions from importOperations
export * from './importOperations';
export * from './parseImportedFile';
