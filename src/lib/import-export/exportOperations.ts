
import { saveAs } from 'file-saver';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ExportFormat, ExportOptions, DataType } from './types';
import { generateCSV } from './csvGenerator';

export async function exportData(
  data: any[],
  options: ExportOptions
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = options.filename || `${options.type}_export_${timestamp}`;

    switch (options.format) {
      case 'json':
        return exportJson(data, `${filename}.json`);
      case 'csv':
        return exportCsv(data, `${filename}.csv`, options.type);
      default:
        throw new Error(`Export format '${options.format}' not supported`);
    }
  } catch (error) {
    console.error(`Error exporting ${options.type}:`, error);
    return false;
  }
}

export async function exportJson(data: any[], filename: string): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return false;
  }
}

export async function exportCsv(
  data: any[], 
  filename: string, 
  type: DataType
): Promise<boolean> {
  try {
    const csv = generateCSV(data, type);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
}

export function exportClients(clients: ClientRecord[], format: ExportFormat = 'json'): Promise<boolean> {
  return exportData(clients, {
    format,
    type: 'clients',
  });
}

export function exportSites(sites: SiteRecord[], format: ExportFormat = 'json'): Promise<boolean> {
  return exportData(sites, {
    format,
    type: 'sites',
  });
}

export function exportContracts(contracts: ContractHistoryEntry[], format: ExportFormat = 'json'): Promise<boolean> {
  return exportData(contracts, {
    format,
    type: 'contracts',
  });
}

export function exportAll(
  data: {
    clients?: ClientRecord[];
    sites?: SiteRecord[];
    contracts?: ContractHistoryEntry[];
  },
  format: ExportFormat = 'json'
): Promise<boolean> {
  return exportData([data], {
    format,
    type: 'unified',
    filename: `all_data_export_${new Date().toISOString().split('T')[0]}`
  });
}
