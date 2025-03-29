
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

export type DataExportType = 
  | 'clients' 
  | 'sites' 
  | 'contractors' 
  | 'contracts' 
  | 'invoices' 
  | 'work-orders'
  | 'quotes';

export interface ExportResult {
  success: boolean;
  message: string;
  data?: any;
  fileUrl?: string;
  fileName?: string;
  format?: string;
  count?: number;
}
