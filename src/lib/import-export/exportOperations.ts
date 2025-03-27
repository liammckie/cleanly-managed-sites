
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import Papa from 'papaparse';

// Export type definitions
export type ExportFormat = 'json' | 'csv' | 'xlsx';
export type DataType = 'clients' | 'sites' | 'contracts' | 'contractors' | 'unified' | 'invoices';

export interface ExportOptions {
  format?: 'json' | 'csv';
  includeRelatedData?: boolean;
  filename?: string;
  type?: DataType;
}

// Export methods
export function exportData(data: any[], options: ExportOptions = {}): boolean {
  const {
    format = 'json',
    filename = `export_${new Date().toISOString().split('T')[0]}`,
    type = 'unified'
  } = options;
  
  let exportFileName = `${filename}_${type}`;
  
  if (format === 'json') {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `${exportFileName}.json`);
  } else if (format === 'csv') {
    // Process data for CSV export
    const processedData = type === 'contracts' 
      ? data.map((item: any) => ({
          ...item,
          contract_details: JSON.stringify(item.contract_details)
        }))
      : data;
      
    const csv = Papa.unparse(processedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${exportFileName}.csv`);
  } else {
    throw new Error(`Unsupported export format: ${format}`);
  }
  
  return true;
}

export function exportClients(clients: ClientRecord[], options: ExportOptions = {}): boolean {
  const exportOptions: ExportOptions = {
    format: options.format || 'json',
    filename: options.filename || `clients_export_${new Date().toISOString().split('T')[0]}`,
    type: 'clients'
  };
  
  return exportData(clients, exportOptions);
}

export function exportSites(sites: SiteRecord[], options: ExportOptions = {}): boolean {
  const exportOptions: ExportOptions = {
    format: options.format || 'json',
    filename: options.filename || `sites_export_${new Date().toISOString().split('T')[0]}`,
    type: 'sites'
  };
  
  return exportData(sites, exportOptions);
}

export function exportContracts(contracts: ContractHistoryEntry[], options: ExportOptions = {}): boolean {
  const exportOptions: ExportOptions = {
    format: options.format || 'json',
    filename: options.filename || `contracts_export_${new Date().toISOString().split('T')[0]}`,
    type: 'contracts'
  };
  
  return exportData(contracts, exportOptions);
}

export function exportContractors(contractors: any[], options: ExportOptions = {}): boolean {
  const exportOptions: ExportOptions = {
    format: options.format || 'json', 
    filename: options.filename || `contractors_export_${new Date().toISOString().split('T')[0]}`,
    type: 'contractors'
  };
  
  return exportData(contractors, exportOptions);
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate unified import template
export const generateUnifiedImportTemplate = (): string => {
  const header = 'record_type,id,name,client_id,site_id,address,city,state,postcode,status,email,phone,contract_details,notes';
  const clientRow = 'client,client_123,Example Corp,,,"123 Main St",New York,NY,10001,active,contact@example.com,555-1234,,Client notes';
  const siteRow = 'site,site_123,Main Office,client_123,,"456 Business Ave",Chicago,IL,60601,active,site@example.com,555-5678,,Site notes';
  const contractRow = 'contract,,,"client_123",site_123,,,,,,,,,"{""startDate"":""2023-01-01"",""endDate"":""2024-01-01""}",Contract notes';
  
  return [header, clientRow, siteRow, contractRow].join('\n');
};
