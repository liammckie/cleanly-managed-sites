
/**
 * Import/Export related type definitions
 */

/**
 * Import mode options
 */
export type ImportMode = 'create' | 'update' | 'upsert';

/**
 * Import options
 */
export interface ImportOptions {
  mode: ImportMode;
  skipValidation?: boolean;
  ignoreErrors?: boolean;
  dryRun?: boolean;
  updateExisting?: boolean;
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  errors: number;
  skipped: number;
  errorMessages: string[];
  data?: any[];
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  includeHeaders?: boolean;
  fields?: string[];
  filters?: Record<string, any>;
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  fileName: string;
  fileSize: number;
  recordCount: number;
  format: string;
  data?: any;
  error?: string;
}

/**
 * Data field mapping for imports/exports
 */
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
}
