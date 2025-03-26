
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

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
