
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
    
    // Site fields - use exact database field names with prefix for mapping
    'site_name', // mapped to name in site table
    'site_address', // mapped to address in site table
    'site_city', // mapped to city in site table
    'site_state', // mapped to state in site table
    'site_postcode', // mapped to postcode in site table
    'site_status', // mapped to status in site table
    'representative',
    'site_phone', // mapped to phone in site table
    'site_email', // mapped to email in site table
    'client_id',
    'monthly_cost',
    'monthly_revenue',
    
    // Contract fields
    'site_id', // Site ID for contract
    'version_number',
    'contract_notes', // mapped to notes in contract table
    'start_date', // Will be mapped to contract_details.startDate
    'end_date', // Will be mapped to contract_details.endDate
    'contract_number', // Will be mapped to contract_details.contractNumber
    'renewal_terms', // Will be mapped to contract_details.renewalTerms
    'termination_period' // Will be mapped to contract_details.terminationPeriod
  ];
  
  // Sample data for clients
  const clientSample = {
    'record_type': 'client',
    'action': 'create',
    'id': '',
    'custom_id': 'CL001',
    'name': 'ACME Corporation',
    'contact_name': 'John Doe',
    'email': 'john@acme.com',
    'phone': '123-456-7890',
    'address': '123 Main St',
    'city': 'New York',
    'state': 'NY',
    'postcode': '10001',
    'status': 'active',
    'notes': 'New client'
  };
  
  // Sample data for sites
  const siteSample = {
    'record_type': 'site',
    'action': 'create',
    'id': '',
    'custom_id': 'ST001',
    'name': '',
    'contact_name': '',
    'email': '',
    'phone': '',
    'address': '',
    'city': '',
    'state': '',
    'postcode': '',
    'status': '',
    'notes': '',
    'site_name': 'Main Office',
    'site_address': '456 Business Ave',
    'site_city': 'Chicago',
    'site_state': 'IL',
    'site_postcode': '60601',
    'site_status': 'active',
    'representative': 'Jane Smith',
    'site_phone': '987-654-3210',
    'site_email': 'jane@acme.com',
    'client_id': 'custom:CL001',
    'monthly_cost': '1000',
    'monthly_revenue': '1500'
  };
  
  // Sample data for contracts
  const contractSample = {
    'record_type': 'contract',
    'action': 'create',
    'id': '',
    'custom_id': '',
    'name': '',
    'contact_name': '',
    'email': '',
    'phone': '',
    'address': '',
    'city': '',
    'state': '',
    'postcode': '',
    'status': '',
    'notes': '',
    'site_name': '',
    'site_address': '',
    'site_city': '',
    'site_state': '',
    'site_postcode': '',
    'site_status': '',
    'representative': '',
    'site_phone': '',
    'site_email': '',
    'client_id': '',
    'monthly_cost': '',
    'monthly_revenue': '',
    'site_id': 'custom:ST001',
    'version_number': '1',
    'contract_notes': 'Standard service contract',
    'start_date': '2023-01-01',
    'end_date': '2024-01-01',
    'contract_number': 'CNT-001',
    'renewal_terms': '30 days automatic renewal',
    'termination_period': '60 days written notice'
  };
  
  // Create one row for each record type so the user can see examples of each
  return Papa.unparse([clientSample, siteSample, contractSample], { header: true });
};
