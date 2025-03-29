
// Re-export validation types for easier access
export type { 
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult,
  ZodValidationResult
} from './validation/types';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from './validation/types';

export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
  type?: string; // Add type property
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
