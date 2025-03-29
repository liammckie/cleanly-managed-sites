
import { Json } from './common';

/**
 * Import options
 */
export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
  format?: string;
  mode?: 'full' | 'incremental';
  type?: 'clients' | 'sites' | 'contracts' | 'unified';
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean;
  message: string;
  count: number;
  data?: any[];
  failures?: any[];
}

/**
 * Export options
 */
export interface ExportOptions {
  format?: 'csv' | 'json' | 'xlsx';
  includeIds?: boolean;
  filters?: Record<string, any>;
}

/**
 * Data types that can be imported/exported
 */
export type DataImportType = 'clients' | 'sites' | 'contractors' | 'contracts' | 'invoices' | 'unified';
export type DataExportType = DataImportType;

/**
 * Validation related types
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationMessage {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
  message?: string;
}

export interface ValidationOptions {
  skipRequiredFields?: boolean;
  additionalValidation?: (data: any) => ValidationError[];
}

/**
 * Legacy validation types for backward compatibility
 */
export interface LegacyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Zod-based validation result
 */
export interface ZodValidationResult {
  success: boolean;
  errors?: ValidationError[];
  data?: any;
}

/**
 * Convert between validation result formats
 */
export function legacyToNewValidationResult(legacy: LegacyValidationResult): ValidationResult {
  return {
    valid: legacy.isValid,
    errors: legacy.errors.map(msg => ({ field: 'unknown', message: msg })),
    warnings: legacy.warnings?.map(msg => ({ field: 'unknown', message: msg, type: 'warning' }))
  };
}

export function newToLegacyValidationResult(result: ValidationResult): LegacyValidationResult {
  return {
    isValid: result.valid,
    errors: result.errors.map(err => `${err.field}: ${err.message}`),
    warnings: result.warnings?.map(warn => `${warn.field}: ${warn.message}`)
  };
}

/**
 * Import item types
 */
export interface ClientImportItem {
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: 'active' | 'inactive' | 'pending';
  notes?: string;
  custom_id?: string;
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
  abn?: string;
  status?: 'active' | 'pending' | 'inactive';
  notes?: string;
}

export interface InvoiceImportItem {
  invoice_number: string;
  client_id: string;
  site_id?: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  line_items?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type?: string;
  account_code?: string;
}
