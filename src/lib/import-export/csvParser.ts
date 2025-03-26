
import Papa from 'papaparse';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ImportOptions, ContractorRecord, ParsedImportData } from './types';

export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
};

export const parseUnifiedImport = async (
  csvData: any[],
  options: ImportOptions
): Promise<ParsedImportData> => {
  const clients: ClientRecord[] = [];
  const sites: SiteRecord[] = [];
  const contracts: Partial<ContractHistoryEntry>[] = [];
  const contractors: ContractorRecord[] = [];

  for (const row of csvData) {
    const recordType = row.record_type?.toLowerCase();

    if (recordType === 'client') {
      clients.push(convertToClientRecord(row));
    } else if (recordType === 'site') {
      sites.push(convertToSiteRecord(row));
    } else if (recordType === 'contract') {
      contracts.push(convertToContractRecord(row));
    } else if (recordType === 'contractor') {
      contractors.push(convertToContractorRecord(row));
    }
  }

  return { clients, sites, contracts, contractors };
};

const convertToClientRecord = (row: any): ClientRecord => {
  return {
    id: row.id || '',
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || '',
    status: row.status || 'active',
    notes: row.notes || '',
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    user_id: row.user_id || '',
    custom_id: row.custom_id || '',
    contact_name: row.contact_name || '',
    xero_contact_id: row.xero_contact_id || ''
  };
};

const convertToSiteRecord = (row: any): SiteRecord => {
  return {
    id: row.id || '',
    name: row.name || '',
    client_id: row.client_id || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || '',
    status: row.status || 'active',
    email: row.email || '',
    phone: row.phone || '',
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    user_id: row.user_id || ''
  };
};

const convertToContractRecord = (row: any): Partial<ContractHistoryEntry> => {
  let contractDetails;
  
  try {
    contractDetails = typeof row.contract_details === 'string' 
      ? JSON.parse(row.contract_details) 
      : row.contract_details || {};
  } catch (error) {
    console.error('Error parsing contract details:', error);
    contractDetails = {};
  }
  
  return {
    site_id: row.site_id || '',
    contract_details: contractDetails,
    notes: row.notes || '',
    created_by: row.created_by || '',
    version_number: Number(row.version_number) || 0
  };
};

const convertToContractorRecord = (row: any): ContractorRecord => {
  return {
    id: row.id,
    name: row.name || '',
    business_name: row.business_name || '',
    contact_name: row.contact_name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    status: row.status || 'active',
    tax_id: row.tax_id || '',
    insurance_info: row.insurance_info || '',
    notes: row.notes || ''
  };
};

export const convertCSVToClientFormat = (csvData: any[]): ClientRecord[] => {
  return csvData.map(convertToClientRecord);
};

export const convertCSVToSiteFormat = (csvData: any[]): SiteRecord[] => {
  return csvData.map(convertToSiteRecord);
};

export const convertCSVToContractFormat = (csvData: any[]): Partial<ContractHistoryEntry>[] => {
  return csvData.map(convertToContractRecord);
};

export const convertCSVToContractorFormat = (csvData: any[]): ContractorRecord[] => {
  return csvData.map(convertToContractorRecord);
};
