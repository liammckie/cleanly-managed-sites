
/**
 * Core import/export type definitions
 * Centralizes all import/export related types
 */

// Import options
export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
  type?: string;
  format?: string;
}

// Import result
export interface ImportResult {
  success: boolean;
  message: string;
  count: number;
  failures?: any[];
  data?: any[];
}

// Export options
export interface ExportOptions {
  includeHeaders?: boolean;
  format?: 'csv' | 'xlsx' | 'json';
  fileName?: string;
  fields?: string[];
  filters?: Record<string, any>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// Export result
export interface ExportResult {
  success: boolean;
  message: string;
  data?: any;
  fileUrl?: string;
  fileName?: string;
  format?: string;
  count?: number;
}

// Data types for import/export
export type DataExportType = 
  | 'clients' 
  | 'sites' 
  | 'contractors' 
  | 'contracts' 
  | 'invoices' 
  | 'work-orders'
  | 'quotes';

export type DataImportType = 
  | 'client' 
  | 'site' 
  | 'contractor' 
  | 'contract' 
  | 'invoice' 
  | 'work-order'
  | 'quote';

// Import item types
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

export interface ContractorImportItem {
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

export interface InvoiceImportItem {
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
