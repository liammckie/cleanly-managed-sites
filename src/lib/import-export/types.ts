
import { ValidationMessage, ValidationResult, EnhancedValidationResult } from '@/types/common';

// Re-export the types
export type { ValidationMessage, ValidationResult, EnhancedValidationResult };

// Define additional types needed
export type ExportFormat = 'json' | 'csv' | 'xlsx';
export type DataType = 'clients' | 'sites' | 'contracts' | 'contractors' | 'unified' | 'invoices';

// Add any additional import-export specific types below
export interface ImportOptions {
  skipValidation?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
  format?: 'json' | 'csv' | 'xlsx';
  type?: DataType;
  mode?: 'full' | 'incremental';
}

export interface ExportOptions {
  format?: 'json' | 'csv';
  includeRelatedData?: boolean;
  filename?: string;
  type?: DataType;
}

export interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: ValidationMessage[];
}

export interface ExportResult {
  success: boolean;
  data: any;
  count: number;
  format: string;
}

export interface ContractorRecord {
  id: string;
  name?: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  postcode?: string;
  abn?: string;
  tax_id?: string;
  insurance_details?: any;
  payment_details?: any;
  services?: string[];
  notes?: string;
  status?: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
  document_ids?: string[];
  contractor_type?: string;
  hourly_rate?: number;
  day_rate?: number;
  specialty?: string[];
  rating?: number;
  custom_id?: string;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  client_id: string;
  site_id?: string;
  amount: number;
  status: string;
  due_date: string;
  issue_date: string;
  paid_date?: string;
  notes?: string;
  payment_method?: string;
  payment_reference?: string;
  line_items?: InvoiceLineItemRecord[];
}

export interface InvoiceLineItemRecord {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate?: number;
  tax_amount?: number;
}
