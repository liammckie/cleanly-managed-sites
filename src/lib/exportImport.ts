
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import Papa from 'papaparse';

// Import file parsing
export const parseImportedFile = async (file: File): Promise<any[]> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExt === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } else if (fileExt === 'json') {
    const text = await file.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Invalid JSON file');
    }
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
  }
};

// Export methods
export const exportClients = (clients: ClientRecord[], format: 'json' | 'csv' = 'json'): boolean => {
  if (format === 'json') {
    const jsonString = JSON.stringify(clients, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `clients_export_${new Date().toISOString().split('T')[0]}.json`);
  } else {
    const csv = Papa.unparse(clients);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
  }
  return true;
};

export const exportSites = (sites: SiteRecord[], format: 'json' | 'csv' = 'json'): boolean => {
  if (format === 'json') {
    const jsonString = JSON.stringify(sites, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `sites_export_${new Date().toISOString().split('T')[0]}.json`);
  } else {
    const csv = Papa.unparse(sites);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `sites_export_${new Date().toISOString().split('T')[0]}.csv`);
  }
  return true;
};

export const exportContracts = (contracts: ContractHistoryEntry[], format: 'json' | 'csv' = 'json'): boolean => {
  if (format === 'json') {
    const jsonString = JSON.stringify(contracts, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `contracts_export_${new Date().toISOString().split('T')[0]}.json`);
  } else {
    const contractsForCsv = contracts.map(c => ({
      ...c,
      contract_details: JSON.stringify(c.contract_details)
    }));
    const csv = Papa.unparse(contractsForCsv);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `contracts_export_${new Date().toISOString().split('T')[0]}.csv`);
  }
  return true;
};

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
