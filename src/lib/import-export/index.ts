
import { supabase } from '@/lib/supabase';
import { ClientRecord, SiteRecord, ContractorRecord } from '@/lib/types';
import { validateClient, validateSite, validateContractor } from './validation';
import Papa from 'papaparse';
import { isObject, isArray } from '@/lib/utils/typeGuards';

/**
 * Parse a CSV file into JSON
 */
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

/**
 * Import clients from data
 */
export const importClients = async (data: any[]): Promise<void> => {
  const validatedClients = data
    .filter(isObject)
    .map(client => validateClient(client))
    .filter(Boolean) as Partial<ClientRecord>[];

  if (validatedClients.length === 0) {
    throw new Error('No valid client data found');
  }

  const { error } = await supabase
    .from('clients')
    .insert(validatedClients);

  if (error) {
    throw new Error(`Failed to import clients: ${error.message}`);
  }
};

/**
 * Import sites from data
 */
export const importSites = async (data: any[]): Promise<void> => {
  const validatedSites = data
    .filter(isObject)
    .map(site => validateSite(site))
    .filter(Boolean) as Partial<SiteRecord>[];

  if (validatedSites.length === 0) {
    throw new Error('No valid site data found');
  }

  const { error } = await supabase
    .from('sites')
    .insert(validatedSites);

  if (error) {
    throw new Error(`Failed to import sites: ${error.message}`);
  }
};

/**
 * Import contractors from data
 */
export const importContractors = async (data: any[]): Promise<void> => {
  const validatedContractors = data
    .filter(isObject)
    .map(contractor => validateContractor(contractor))
    .filter(Boolean) as Partial<ContractorRecord>[];

  if (validatedContractors.length === 0) {
    throw new Error('No valid contractor data found');
  }

  const { error } = await supabase
    .from('contractors')
    .insert(validatedContractors);

  if (error) {
    throw new Error(`Failed to import contractors: ${error.message}`);
  }
};

/**
 * Import contracts from data
 */
export const importContracts = async (data: any[]): Promise<void> => {
  if (!isArray(data) || data.length === 0) {
    throw new Error('No valid contract data found');
  }

  // Process contract data
  const processedData = data.map(item => ({
    ...item,
    user_id: supabase.auth.getUser() || null
  }));

  const { error } = await supabase
    .from('site_contract_history')
    .insert(processedData);

  if (error) {
    throw new Error(`Failed to import contracts: ${error.message}`);
  }
};

/**
 * Convert CSV data to client format
 */
export const convertCSVToClientFormat = (csvData: any[]): Partial<ClientRecord>[] => {
  return csvData.map(row => ({
    name: row.name || row.Name || '',
    contact_name: row.contact_name || row.ContactName || '',
    email: row.email || row.Email || '',
    phone: row.phone || row.Phone || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.PostCode || row.postal_code || row.PostalCode || '',
    status: row.status || row.Status || 'active',
  }));
};

/**
 * Convert CSV data to site format
 */
export const convertCSVToSiteFormat = (csvData: any[]): Partial<SiteRecord>[] => {
  return csvData.map(row => ({
    name: row.name || row.Name || '',
    address: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    postcode: row.postcode || row.PostCode || row.postal_code || row.PostalCode || '',
    client_id: row.client_id || row.ClientId || '',
    status: row.status || row.Status || 'active',
  }));
};

/**
 * Convert CSV data to contractor format
 */
export const convertCSVToContractorFormat = (csvData: any[]): Partial<ContractorRecord>[] => {
  return csvData.map(row => ({
    business_name: row.business_name || row.BusinessName || '',
    contact_name: row.contact_name || row.ContactName || '',
    email: row.email || row.Email || '',
    phone: row.phone || row.Phone || '',
    contractor_type: row.contractor_type || row.ContractorType || 'cleaning',
    status: row.status || row.Status || 'active',
  }));
};

/**
 * Convert CSV data to contract format
 */
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    site_id: row.site_id || row.SiteId || '',
    contract_details: {
      contractNumber: row.contract_number || row.ContractNumber || '',
      startDate: row.start_date || row.StartDate || '',
      endDate: row.end_date || row.EndDate || '',
      contractType: row.contract_type || row.ContractType || 'cleaning',
      autoRenewal: (row.auto_renewal === 'true' || row.AutoRenewal === 'true') || false,
    },
    notes: row.notes || row.Notes || '',
  }));
};
