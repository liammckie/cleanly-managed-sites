
import Papa from 'papaparse';
import { ClientRecord, SiteRecord, ContractHistoryEntry, ContractorRecord } from '@/lib/types';

/**
 * Parse CSV data into an array of objects
 */
export function parseCSV(csvData: string) {
  if (!csvData) return [];
  
  const parsed = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });
  
  return parsed.data;
}

/**
 * Parse a unified import format into separate entity arrays
 */
export function parseUnifiedImport(csvData: string) {
  const rows = parseCSV(csvData);
  
  if (!rows || !rows.length) return {
    clients: [],
    sites: [],
    contracts: [],
    contractors: []
  };
  
  const clients: Partial<ClientRecord>[] = [];
  const sites: Partial<SiteRecord>[] = [];
  const contracts: Partial<ContractHistoryEntry>[] = [];
  const contractors: Partial<ContractorRecord>[] = [];
  
  // Process each row and sort into appropriate arrays
  rows.forEach((row: any) => {
    const type = row.type?.toLowerCase();
    
    if (type === 'client') {
      clients.push({
        name: row.name,
        contact_name: row.contact_name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        city: row.city,
        state: row.state,
        postcode: row.postcode || row.postal_code,
        user_id: row.user_id
      });
    } else if (type === 'site') {
      sites.push({
        name: row.name,
        address: row.address,
        client_id: row.client_id,
        client_name: row.client_name,
        // Add other fields
      });
    } else if (type === 'contract') {
      contracts.push({
        site_id: row.site_id,
        notes: row.notes,
        // Add other fields
      });
    } else if (type === 'contractor') {
      contractors.push({
        business_name: row.business_name,
        contact_name: row.contact_name,
        email: row.email,
        phone: row.phone,
        // Add other fields
      });
    }
  });
  
  return { clients, sites, contracts, contractors };
}

/**
 * Convert CSV data to client format
 */
export function convertCSVToClientFormat(csvData: string): Partial<ClientRecord>[] {
  const rows = parseCSV(csvData);
  
  return rows.map((row: any) => ({
    name: row.name,
    contact_name: row.contact_name || row.contact,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    postcode: row.postcode || row.postal_code
  }));
}

/**
 * Convert CSV data to site format
 */
export function convertCSVToSiteFormat(csvData: string): Partial<SiteRecord>[] {
  const rows = parseCSV(csvData);
  
  return rows.map((row: any) => ({
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    postcode: row.postcode || row.postal_code,
    client_id: row.client_id,
    client_name: row.client_name
  }));
}

/**
 * Convert CSV data to contract format
 */
export function convertCSVToContractFormat(csvData: string): Partial<ContractHistoryEntry>[] {
  const rows = parseCSV(csvData);
  
  return rows.map((row: any) => ({
    site_id: row.site_id,
    notes: row.notes,
    // Add contract specific fields
  }));
}

/**
 * Convert CSV data to contractor format
 */
export function convertCSVToContractorFormat(csvData: string): Partial<ContractorRecord>[] {
  const rows = parseCSV(csvData);
  
  return rows.map((row: any) => ({
    business_name: row.business_name || row.name,
    contact_name: row.contact_name || row.contact,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    postcode: row.postcode || row.postal_code
  }));
}
