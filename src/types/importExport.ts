
export interface ValidationMessage {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  message?: string;
  data?: any[];
  imported?: number;
}

export interface ImportOptions {
  format: 'json' | 'csv';
  type: 'clients' | 'sites' | 'contracts' | 'unified';
  mode: 'full' | 'incremental';
}

export type DataType = 'clients' | 'sites' | 'contracts' | 'users' | 'contractors';
export type DataImportType = DataType;
export type DataExportType = DataType;
