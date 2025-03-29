
export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
  type?: string;
  format?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  count: number;
  failures?: any[];
  data?: any[];
}

export type DataImportType = 
  | 'client' 
  | 'site' 
  | 'contractor' 
  | 'contract' 
  | 'invoice' 
  | 'work-order'
  | 'quote';

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
