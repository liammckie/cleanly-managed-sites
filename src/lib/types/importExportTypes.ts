
/**
 * Import/Export types for data migration
 */
import { Json } from './common';
import { ValidationError, ValidationResult } from './validationTypes';

// Import options
export interface ImportOptions {
  validateOnly?: boolean;
  dryRun?: boolean;
  updateExisting?: boolean;
  createMissing?: boolean;
  identifyBy?: string[];
  batchSize?: number;
  userId?: string;
  mode?: 'full' | 'incremental';
}

// Import result
export interface ImportResult {
  success: boolean;
  message: string;
  count: number;
  data?: any[];
  failures?: any[];
  errors?: ValidationError[];
  warnings?: string[];
}

// Export options
export interface ExportOptions {
  format?: 'csv' | 'json' | 'xlsx';
  includeHeaders?: boolean;
  dateFormat?: string;
  filename?: string;
  filters?: Record<string, any>;
}

// Export result
export interface ExportResult {
  success: boolean;
  message: string;
  count: number;
  data?: any;
  filename?: string;
  mimeType?: string;
}

// Data types for import/export
export type DataImportType = 'clients' | 'sites' | 'contracts' | 'contractors' | 'invoices' | 'unified';
export type DataExportType = 'clients' | 'sites' | 'contracts' | 'contractors' | 'invoices' | 'unified';

// Client import item
export interface ClientImportItem {
  id?: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: 'active' | 'inactive' | 'pending' | 'prospect';
  notes?: string;
  custom_id?: string;
  xero_contact_id?: string;
}

// Contractor import item
export interface ContractorImportItem {
  id?: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: 'active' | 'pending' | 'inactive';
  notes?: string;
  abn?: string;
  contractor_type?: string;
  specialty?: string[];
  hourly_rate?: number;
  insurance_details?: Json;
}

// Invoice import item
export interface InvoiceImportItem {
  id?: string;
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  amount: number;
  status?: string;
  client_id?: string;
  site_id?: string;
  notes?: string;
  line_items?: InvoiceLineItem[];
}

// Invoice line item
export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate?: number;
  tax_amount?: number;
  account_code?: string;
}
