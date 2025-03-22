import { supabase } from '../supabase';
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ParsedImportData, InvoiceRecord, InvoiceLineItemRecord } from './types';

export type ValidationMessage = {
  row: number;
  field: string;
  message: string;
  value: any;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
};

// Check if items already exist in the database
export const checkExistingItems = async (
  type: 'clients' | 'sites' | 'site_contract_history' | 'invoices' | 'invoice_line_items', 
  ids: string[]
): Promise<string[]> => {
  if (ids.length === 0) return [];
  
  try {
    let { data } = await supabase
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
  importData: ParsedImportData,
  existingData: ParsedImportData
): Promise<ParsedImportData> => {
  // Create maps of existing data for faster lookups
  const clientsMap = new Map(existingData.clients.map(client => [client.id, client]));
  const sitesMap = new Map(existingData.sites.map(site => [site.id, site]));
  const contractsMap = new Map(existingData.contracts.map(contract => [contract.id, contract]));
  const invoicesMap = new Map((existingData.invoices || []).map(invoice => [invoice.id, invoice]));
  
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
  
  // Process sites
  const mergedSites = [...existingData.sites];
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
  
  // Process contracts
  const mergedContracts = [...existingData.contracts];
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

// Validate client data
export const validateClientData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<ClientRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: 'Client name is required',
        value: row.name
      });
    }
    
    if (!row.contact_name) {
      errors.push({
        row: index + 1,
        field: 'contact_name',
        message: 'Contact name is required',
        value: row.contact_name
      });
    }
    
    if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
      warnings.push({
        row: index + 1,
        field: 'email',
        message: 'Email format appears to be invalid',
        value: row.email
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.name && row.contact_name) {
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};

// Validate site data
export const validateSiteData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<SiteRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: 'Site name is required',
        value: row.name
      });
    }
    
    if (!row.address) {
      errors.push({
        row: index + 1,
        field: 'address',
        message: 'Site address is required',
        value: row.address
      });
    }
    
    if (!row.client_id) {
      errors.push({
        row: index + 1,
        field: 'client_id',
        message: 'Client ID is required',
        value: row.client_id
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.name && row.address && row.client_id) {
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};

// Validate contract data
export const validateContractData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<ContractHistoryEntry>[] = [];
  
  data.forEach((row, index) => {
    if (!row.site_id) {
      errors.push({
        row: index + 1,
        field: 'site_id',
        message: 'Site ID is required',
        value: row.site_id
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.site_id) {
      // Add to valid data even with warnings
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};

// Validate invoice data
export const validateInvoiceData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<InvoiceRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.client_id) {
      errors.push({
        row: index + 1,
        field: 'client_id',
        message: 'Client ID is required',
        value: row.client_id
      });
    }
    
    if (!row.invoice_date) {
      errors.push({
        row: index + 1,
        field: 'invoice_date',
        message: 'Invoice date is required',
        value: row.invoice_date
      });
    }
    
    if (!row.amount && row.amount !== 0) {
      errors.push({
        row: index + 1,
        field: 'amount',
        message: 'Invoice amount is required',
        value: row.amount
      });
    }
    
    if (!row.status) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Invoice status is missing, will default to "draft"',
        value: row.status
      });
    } else if (!['draft', 'sent', 'paid', 'overdue', 'void'].includes(row.status)) {
      warnings.push({
        row: index + 1,
        field: 'status',
        message: 'Invoice status should be one of: draft, sent, paid, overdue, void',
        value: row.status
      });
    }
    
    // Check date formats
    if (row.invoice_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.invoice_date)) {
      warnings.push({
        row: index + 1,
        field: 'invoice_date',
        message: 'Invoice date should be in YYYY-MM-DD format',
        value: row.invoice_date
      });
    }
    
    if (row.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
      warnings.push({
        row: index + 1,
        field: 'due_date',
        message: 'Due date should be in YYYY-MM-DD format',
        value: row.due_date
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.client_id && row.invoice_date && (row.amount !== undefined)) {
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};

// Validate invoice line item data
export const validateInvoiceLineItemData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<InvoiceLineItemRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.invoice_id) {
      errors.push({
        row: index + 1,
        field: 'invoice_id',
        message: 'Invoice ID is required',
        value: row.invoice_id
      });
    }
    
    if (!row.description) {
      errors.push({
        row: index + 1,
        field: 'description',
        message: 'Line item description is required',
        value: row.description
      });
    }
    
    if (row.quantity === undefined || row.quantity === null) {
      warnings.push({
        row: index + 1,
        field: 'quantity',
        message: 'Line item quantity is missing, will default to 1',
        value: row.quantity
      });
    }
    
    if (row.unit_price === undefined || row.unit_price === null) {
      errors.push({
        row: index + 1,
        field: 'unit_price',
        message: 'Line item unit price is required',
        value: row.unit_price
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.invoice_id && row.description && row.unit_price !== undefined) {
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};
