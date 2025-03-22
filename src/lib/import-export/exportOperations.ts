
import { saveAs } from 'file-saver';
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import Papa from 'papaparse';

// Function to export data to JSON file
export const exportToJson = (data: any, fileName: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, fileName);
};

// Export to CSV file
export const exportToCSV = (data: any[], fileName: string): void => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`);
};

// Export clients to JSON file
export const exportClients = (clients: ClientRecord[]): void => {
  exportToJson(clients, `clients-export-${new Date().toISOString().slice(0, 10)}.json`);
};

// Export sites to JSON file
export const exportSites = (sites: SiteRecord[]): void => {
  exportToJson(sites, `sites-export-${new Date().toISOString().slice(0, 10)}.json`);
};

// Export contracts to JSON file
export const exportContracts = (contracts: ContractHistoryEntry[]): void => {
  exportToJson(contracts, `contracts-export-${new Date().toISOString().slice(0, 10)}.json`);
};

// Generate a single unified import template
export const generateUnifiedImportTemplate = (): string => {
  const headers = [
    'record_type', // Type of record: client, site, or contract
    'action', // Action to take: create, update, or delete
    'id', // Database ID (blank for new records)
    'custom_id', // Custom identifier
    
    // Client fields
    'client_name',
    'client_contact_name',
    'client_email',
    'client_phone',
    'client_address',
    'client_city',
    'client_state',
    'client_postcode',
    'client_status',
    'client_notes',
    
    // Site fields
    'site_name',
    'site_address',
    'site_city',
    'site_state',
    'site_postcode',
    'site_status',
    'site_representative',
    'site_phone',
    'site_email',
    'site_client_id', // Can be database ID or custom_id (prefixed with "custom:")
    'site_monthly_cost',
    'site_monthly_revenue',
    
    // Contract fields
    'contract_site_id', // Can be database ID or custom_id (prefixed with "custom:")
    'contract_start_date',
    'contract_end_date',
    'contract_number',
    'contract_renewal_terms',
    'contract_termination_period',
    'contract_notes'
  ];
  
  // Sample data for clients
  const clientSample = [
    'client', 'create', '', 'CL001', // Record type, action, id, custom_id
    'ACME Corporation', 'John Doe', 'john@acme.com', '123-456-7890',
    '123 Main St', 'New York', 'NY', '10001', 'active', 'New client',
    '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', ''
  ];
  
  // Sample data for sites
  const siteSample = [
    'site', 'create', '', 'ST001',
    '', '', '', '', '', '', '', '', '', '',
    'Main Office', '456 Business Ave', 'Chicago', 'IL', '60601', 'active',
    'Jane Smith', '987-654-3210', 'jane@acme.com', 'custom:CL001', '1000', '1500',
    '', '', '', '', '', '', ''
  ];
  
  // Sample data for contracts
  const contractSample = [
    'contract', 'create', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '',
    'custom:ST001', '2023-01-01', '2024-01-01', 'CNT-001', '30 days automatic renewal', '60 days written notice', 'Standard service contract'
  ];
  
  // Combine the samples
  const samples = [clientSample, siteSample, contractSample];
  
  return Papa.unparse(samples, { header: true, columns: headers });
};
