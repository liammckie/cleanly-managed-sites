
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
  // Define the headers with correct database field names
  const headers = [
    'record_type', // Type of record: client, site, or contract
    'action', // Action to take: create, update, or delete
    'id', // Database ID (blank for new records)
    'custom_id', // Custom identifier
    
    // Client fields - use exact database field names
    'name', // client name
    'contact_name',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'postcode',
    'status',
    'notes',
    
    // Site fields - use exact database field names 
    'site_name', // special case - will be mapped to name in site table
    'site_address', // special case - will be mapped to address in site table
    'site_city', // special case - will be mapped to city in site table
    'site_state', // special case - will be mapped to state in site table
    'site_postcode', // special case - will be mapped to postcode in site table
    'site_status', // special case - will be mapped to status in site table
    'representative',
    'site_phone', // special case - will be mapped to phone in site table
    'site_email', // special case - will be mapped to email in site table
    'client_id',
    'monthly_cost',
    'monthly_revenue',
    
    // Contract fields
    'site_id', // Site ID for contract
    'version_number',
    'contract_notes', // special case - will be mapped to notes in contract table
    'start_date', // Will be mapped to contract_details.startDate
    'end_date', // Will be mapped to contract_details.endDate
    'contract_number', // Will be mapped to contract_details.contractNumber
    'renewal_terms', // Will be mapped to contract_details.renewalTerms
    'termination_period' // Will be mapped to contract_details.terminationPeriod
  ];
  
  // Sample data for clients
  const clientSample = [
    'client', 'create', '', 'CL001', // Record type, action, id, custom_id
    'ACME Corporation', 'John Doe', 'john@acme.com', '123-456-7890',
    '123 Main St', 'New York', 'NY', '10001', 'active', 'New client',
    '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', ''
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
    'custom:ST001', '1', 'Standard service contract', '2023-01-01', '2024-01-01', 'CNT-001', 
    '30 days automatic renewal', '60 days written notice'
  ];
  
  // Combine the samples
  const samples = [clientSample, siteSample, contractSample];
  
  return Papa.unparse(samples, { header: true, columns: headers });
};

