
// Import/Export Related Types
export type DataImportType = 'clients' | 'sites' | 'contractors' | 'contracts' | 'invoices';
export type DataExportType = 'clients' | 'sites' | 'contractors' | 'contracts' | 'invoices';

export interface ImportOptions {
  mode?: 'create' | 'update' | 'upsert';
  skipValidation?: boolean;
  updateExisting?: boolean;
  skipExistingCheck?: boolean;
  dryRun?: boolean;
  message?: string;
  userId?: string;
}

export interface ExportOptions {
  format?: 'csv' | 'json' | 'xlsx';
  includeHeaders?: boolean;
  fileName?: string;
  filters?: Record<string, any>;
}

export interface ImportResult {
  success: boolean;
  count: number;
  message?: string;
  data?: any[];
  failures?: any[];
}

export interface ExportResult {
  success: boolean;
  data?: any;
  count?: number;
  message?: string;
  fileName?: string;
}

export interface ValidationMessage {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
  validData?: any[];
}

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
  customId?: string;
  id?: string;
}

export interface ContractorImportItem {
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  contractor_type?: string;
  specialty?: string[];
  hourly_rate?: number;
  day_rate?: number;
  notes?: string;
  status?: string;
  abn?: string;
  tax_id?: string;
}

export interface InvoiceImportItem {
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  amount: number;
  client_id?: string;
  site_id?: string;
  work_order_id?: string;
  status?: string;
  notes?: string;
  line_items?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type?: string;
  xero_account_code?: string;
}
