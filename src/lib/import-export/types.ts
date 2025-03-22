
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export type ImportMode = 'full' | 'incremental';

export type ImportOptions = {
  mode: ImportMode;
};

export type ParsedImportData = {
  clients: any[];
  sites: any[];
  contracts: any[];
  invoices?: any[];
};

export interface InvoiceRecord {
  id?: string;
  client_id: string;
  site_id?: string;
  work_order_id?: string;
  invoice_number?: string;
  xero_invoice_id?: string;
  invoice_date: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  amount: number;
  gst_inclusive: boolean;
  xero_synced_at?: string;
  sync_status?: string;
  notes?: string;
  lineItems?: InvoiceLineItemRecord[];
}

export interface InvoiceLineItemRecord {
  id?: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_type?: string;
  xero_account_code?: string;
}
