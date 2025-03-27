
// Re-export validation types for easier access
export type { 
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions 
} from './validation/types';

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

// Legacy validation structure - to maintain compatibility
export interface LegacyValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}

// Add cross-mapping functions to help with legacy code
export function legacyToNewValidationResult<T>(legacy: LegacyValidationResult<T>): ValidationResult<T> {
  return {
    valid: legacy.isValid,
    data: legacy.data,
    errors: legacy.errors,
    warnings: legacy.warnings
  };
}

export function newToLegacyValidationResult<T>(result: ValidationResult<T>): LegacyValidationResult<T> {
  return {
    isValid: result.valid,
    data: result.data,
    errors: result.errors,
    warnings: (result as any).warnings
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
  line_items?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id?: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_type?: string;
}
