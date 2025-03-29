
import { Json } from '@/lib/types/common';

export type DataImportType = 'clients' | 'sites' | 'contractors' | 'contracts' | 'invoices';
export type DataExportType = DataImportType;

export interface ImportOptions {
  mode: 'full' | 'incremental';
  skipExistingCheck?: boolean;
  checkDuplicates?: boolean;
}

export interface ImportResult {
  success: boolean;
  count: number;
  data?: any[];
  failures?: any[];
}

export interface ValidationError {
  field: string;
  message: string;
  row?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  validData?: any[];
  warnings?: string[];
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
  custom_id?: string;
  notes?: string;
  status?: string;
}

export interface ContractorImportItem {
  business_name: string;
  contact_name: string;
  contractor_type: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  abn?: string;
  tax_id?: string;
  hourly_rate?: number;
  day_rate?: number;
  notes?: string;
  specialty?: string[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type?: string;
  xero_account_code?: string;
}

export interface InvoiceImportItem {
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  amount: number;
  client_id?: string;
  site_id?: string;
  work_order_id?: string;
  notes?: string;
  gst_inclusive?: boolean;
  line_items?: InvoiceLineItem[];
}
