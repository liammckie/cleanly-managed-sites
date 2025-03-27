
import Papa from 'papaparse';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { validateClientData } from './validation/clientValidation';
import { validateSiteData } from './validation/siteValidation';
import { validateContractorData } from './validation/contractorValidation';
import { validateContractData } from './validation/contractValidation';

// Parse a CSV file into JSON data
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Convert CSV data to client format
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || row.Name || '',
    contact_name: row.contact_name || row.ContactName || row.contact || '',
    email: row.email || row.Email || '',
    phone: row.phone || row.Phone || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.postal_code || row.PostalCode || '',
    country: row.country || row.Country || 'Australia',
    status: row.status || 'active'
  }));
};

// Convert CSV data to site format
export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || row.Name || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.postal_code || row.PostalCode || '',
    country: row.country || row.Country || 'Australia',
    client_id: row.client_id || row.ClientId || null,
    client_name: row.client_name || row.ClientName || '',
    status: row.status || 'active'
  }));
};

// Convert CSV data to contractor format
export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    business_name: row.business_name || row.BusinessName || row.name || row.Name || '',
    contact_name: row.contact_name || row.ContactName || '',
    email: row.email || row.Email || '',
    phone: row.phone || row.Phone || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.postal_code || row.PostalCode || '',
    abn: row.abn || row.ABN || '',
    tax_id: row.tax_id || row.TaxId || '',
    contractor_type: row.contractor_type || row.ContractorType || 'cleaning',
    status: row.status || 'active'
  }));
};

// Convert CSV data to contract format
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    site_id: row.site_id || row.SiteId || '',
    start_date: row.start_date || row.StartDate || '',
    end_date: row.end_date || row.EndDate || '',
    contract_number: row.contract_number || row.ContractNumber || '',
    contract_type: row.contract_type || row.ContractType || 'cleaning',
    value: parseFloat(row.value) || 0,
    billing_cycle: row.billing_cycle || row.BillingCycle || 'monthly',
  }));
};

// Import clients into the database
export const importClients = async (clients: any[]): Promise<void> => {
  // Validate client data
  const validationResult = validateClientData(clients);
  
  if (!validationResult.isValid) {
    console.error('Invalid client data:', validationResult.errors);
    throw new Error(`Invalid client data: ${validationResult.errors.map(e => e.message).join(', ')}`);
  }
  
  const { data, errors } = await supabase
    .from('clients')
    .insert(validationResult.data);
    
  if (errors) {
    console.error('Error importing clients:', errors);
    throw new Error(`Failed to import clients: ${errors[0].message}`);
  }
  
  return;
};

// Import sites into the database
export const importSites = async (sites: any[]): Promise<void> => {
  // Validate site data
  const validationResult = validateSiteData(sites);
  
  if (!validationResult.isValid) {
    console.error('Invalid site data:', validationResult.errors);
    throw new Error(`Invalid site data: ${validationResult.errors.map(e => e.message).join(', ')}`);
  }
  
  const { data, errors } = await supabase
    .from('sites')
    .insert(validationResult.data);
    
  if (errors) {
    console.error('Error importing sites:', errors);
    throw new Error(`Failed to import sites: ${errors[0].message}`);
  }
  
  return;
};

// Import contractors into the database
export const importContractors = async (contractors: any[]): Promise<void> => {
  // Validate contractor data
  const validationResult = validateContractorData(contractors);
  
  if (!validationResult.isValid) {
    console.error('Invalid contractor data:', validationResult.errors);
    throw new Error(`Invalid contractor data: ${validationResult.errors.map(e => e.message).join(', ')}`);
  }
  
  const { data, errors } = await supabase
    .from('contractors')
    .insert(validationResult.data);
    
  if (errors) {
    console.error('Error importing contractors:', errors);
    throw new Error(`Failed to import contractors: ${errors[0].message}`);
  }
  
  return;
};

// Import contracts into the database
export const importContracts = async (contracts: any[]): Promise<void> => {
  // Validate contract data
  const validationResult = validateContractData(contracts);
  
  if (!validationResult.isValid) {
    console.error('Invalid contract data:', validationResult.errors);
    throw new Error(`Invalid contract data: ${validationResult.errors.map(e => e.message).join(', ')}`);
  }
  
  const { data, errors } = await supabase
    .from('site_additional_contracts')
    .insert(validationResult.data);
    
  if (errors) {
    console.error('Error importing contracts:', errors);
    throw new Error(`Failed to import contracts: ${errors[0].message}`);
  }
  
  return;
};
