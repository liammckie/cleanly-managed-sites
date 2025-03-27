
import { 
  ValidationMessage, 
  ValidationResult, 
  EnhancedValidationResult, 
  ValidationError,
  LegacyValidationResult
} from '@/types/common';

export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  count: number;
  failures?: any[];
  data?: any[];
}

export interface ExportOptions {
  includeHeaders?: boolean;
  format?: 'csv' | 'xlsx' | 'json';
  fileName?: string;
}

// Define the DataType for csvGenerator
export type DataType = 'client' | 'site' | 'contractor' | 'invoice' | 'contract';

// Add cross-mapping functions to help with legacy code
export function legacyToNewValidationResult<T>(legacy: LegacyValidationResult<T>): ValidationResult<T> {
  return {
    valid: legacy.isValid,
    data: legacy.data,
    errors: legacy.errors
  };
}

export function newToLegacyValidationResult<T>(result: ValidationResult<T>): LegacyValidationResult<T> {
  return {
    isValid: result.valid,
    data: result.data,
    errors: result.errors,
    warnings: (result as EnhancedValidationResult<T>).warnings
  };
}

// Add missing types from import-export module
export interface ClientImportItem {
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: string;
  notes?: string;
}

export interface ContractorRecord {
  id?: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  abn?: string;
  contractor_type: string;
  status?: string;
  specialty?: string[];
  notes?: string;
}

export interface InvoiceRecord {
  id?: string;
  invoice_number: string;
  client_id: string;
  site_id?: string;
  amount: number;
  invoice_date: string;
  due_date?: string;
  status: string;
  notes?: string;
}
