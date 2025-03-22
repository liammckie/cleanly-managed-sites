
import { saveAs } from 'file-saver';
import { ClientRecord, SiteRecord } from './types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { fileToBase64 } from './fileUtils';

// Function to export data to JSON file
export const exportToJson = (data: any, fileName: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, fileName);
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

// Parse imported JSON file
export const parseImportedFile = async (file: File): Promise<any> => {
  try {
    const fileContent = await file.text();
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error parsing imported file:', error);
    throw new Error('Invalid file format. Please upload a valid JSON file.');
  }
};

// Validate client data structure
export const validateClientData = (data: any[]): boolean => {
  if (!Array.isArray(data)) return false;
  
  // Check if data has the required fields for clients
  return data.every(item => 
    item.name !== undefined && 
    item.contact_name !== undefined
  );
};

// Validate site data structure
export const validateSiteData = (data: any[]): boolean => {
  if (!Array.isArray(data)) return false;
  
  // Check if data has the required fields for sites
  return data.every(item => 
    item.name !== undefined && 
    item.address !== undefined && 
    item.client_id !== undefined
  );
};

// Validate contract data structure
export const validateContractData = (data: any[]): boolean => {
  if (!Array.isArray(data)) return false;
  
  // Check if data has the required fields for contracts
  return data.every(item => 
    item.site_id !== undefined && 
    item.contract_details !== undefined
  );
};
