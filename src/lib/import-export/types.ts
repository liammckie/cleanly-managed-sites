
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { Json } from '@/lib/types';

export type ImportFormat = 'json' | 'csv' | 'xlsx';
export type ExportFormat = 'json' | 'csv' | 'xlsx';
export type DataType = 'clients' | 'sites' | 'contracts' | 'unified';

export interface ValidationMessage {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
}

export interface ImportOptions {
  format: ImportFormat;
  type: DataType;
  validateOnly?: boolean;
  skipValidation?: boolean;
  mode?: 'full' | 'incremental';
}

export interface ExportOptions {
  format: ExportFormat;
  type: DataType;
  filename?: string;
}

export interface ImportResult {
  success: boolean;
  type: DataType;
  count: number;
  errors?: ValidationMessage[];
  warnings?: ValidationMessage[];
}

export interface TemplateField {
  name: string;
  description: string;
  required: boolean;
  example: string;
}

export interface CsvTemplate {
  headers: string[];
  fields: TemplateField[];
  example: Record<string, string>[];
}

export interface ImportData {
  clients?: ClientRecord[];
  sites?: SiteRecord[];
  contracts?: ContractHistoryEntry[];
}

export interface ContractorRecord {
  id?: string;
  name: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  tax_id: string;
  insurance_info: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceRecord {
  id?: string;
  invoice_number: string;
  site_id: string;
  client_id: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes: string;
  line_items?: InvoiceLineItemRecord[];
}

export interface InvoiceLineItemRecord {
  id?: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_rate?: number;
  service_date?: string;
  service_type?: string;
}

export interface ParsedImportData {
  clients: ClientRecord[];
  sites: SiteRecord[];
  contracts: ContractHistoryEntry[];
  contractors?: ContractorRecord[];
}
