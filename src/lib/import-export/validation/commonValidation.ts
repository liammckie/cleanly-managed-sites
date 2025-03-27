
import { supabase } from '../../supabase';
import { ValidationMessage, ValidationResult, ValidationError } from '../types';

// Check if items already exist in the database
export const checkExistingItems = async (
  type: 'clients' | 'sites' | 'site_contract_history' | 'invoices' | 'invoice_line_items', 
  ids: string[]
): Promise<string[]> => {
  if (ids.length === 0) return [];
  
  try {
    const { data } = await supabase
      .from(type)
      .select('id')
      .in('id', ids);
    
    return data?.map(item => item.id) || [];
  } catch (error) {
    console.error(`Error checking existing ${type}:`, error);
    return [];
  }
};

// Merge imported data with existing data (for incremental imports)
export const mergeImportData = async (
  importData: any,
  existingData: any
): Promise<any> => {
  // Create maps of existing data for faster lookups
  const clientsMap = new Map(existingData.clients.map((client: any) => [client.id, client]));
  const sitesMap = new Map(existingData.sites.map((site: any) => [site.id, site]));
  const contractsMap = new Map(existingData.contracts.map((contract: any) => [contract.id, contract]));
  const invoicesMap = new Map((existingData.invoices || []).map((invoice: any) => [invoice.id, invoice]));
  
  // Helper function to merge objects, where import values override existing values if present
  const mergeObjects = (existing: any, imported: any) => {
    const result = { ...existing };
    
    for (const key in imported) {
      if (imported[key] !== null && imported[key] !== undefined) {
        result[key] = imported[key];
      }
    }
    
    return result;
  };
  
  // Process clients
  const mergedClients = [...existingData.clients];
  if (importData.clients) {
    for (const importedClient of importData.clients) {
      if (importedClient.id && clientsMap.has(importedClient.id)) {
        // Update existing client
        const existingClient = clientsMap.get(importedClient.id);
        if (existingClient) {
          const index = mergedClients.findIndex(c => c.id === importedClient.id);
          mergedClients[index] = mergeObjects(existingClient, importedClient);
        }
      } else {
        // Add new client
        mergedClients.push(importedClient);
      }
    }
  }
  
  // Process sites
  const mergedSites = [...existingData.sites];
  if (importData.sites) {
    for (const importedSite of importData.sites) {
      if (importedSite.id && sitesMap.has(importedSite.id)) {
        // Update existing site
        const existingSite = sitesMap.get(importedSite.id);
        if (existingSite) {
          const index = mergedSites.findIndex(s => s.id === importedSite.id);
          mergedSites[index] = mergeObjects(existingSite, importedSite);
        }
      } else {
        // Add new site
        mergedSites.push(importedSite);
      }
    }
  }
  
  // Process contracts
  const mergedContracts = [...existingData.contracts];
  if (importData.contracts) {
    for (const importedContract of importData.contracts) {
      if (importedContract.id && contractsMap.has(importedContract.id)) {
        // Update existing contract
        const existingContract = contractsMap.get(importedContract.id);
        if (existingContract) {
          const index = mergedContracts.findIndex(c => c.id === importedContract.id);
          mergedContracts[index] = mergeObjects(existingContract, importedContract);
        }
      } else {
        // Add new contract
        mergedContracts.push(importedContract);
      }
    }
  }
  
  // Process invoices
  const mergedInvoices = [...(existingData.invoices || [])];
  if (importData.invoices) {
    for (const importedInvoice of importData.invoices) {
      if (importedInvoice.id && invoicesMap.has(importedInvoice.id)) {
        // Update existing invoice
        const existingInvoice = invoicesMap.get(importedInvoice.id);
        if (existingInvoice) {
          const index = mergedInvoices.findIndex(i => i.id === importedInvoice.id);
          mergedInvoices[index] = mergeObjects(existingInvoice, importedInvoice);
        }
      } else {
        // Add new invoice
        mergedInvoices.push(importedInvoice);
      }
    }
  }
  
  return {
    clients: mergedClients,
    sites: mergedSites,
    contracts: mergedContracts,
    invoices: mergedInvoices
  };
};

// Validate basic data structure
export const validateBasicData = (data: any, requiredFields: string[]): ValidationResult<any> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let valid = true;
  
  if (!data) {
    errors.push({
      path: '',
      message: 'No data provided'
    });
    valid = false;
    return { valid, errors, warnings };
  }
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      errors.push({
        path: field,
        message: `${field} is required`
      });
      valid = false;
    }
  }
  
  return { valid, data, errors, warnings };
};
