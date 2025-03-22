
import { supabase } from '../supabase';
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { validateClientData, validateSiteData, validateContractData, validateInvoiceData, validateInvoiceLineItemData, checkExistingItems } from './dataValidation';
import { ParsedImportData, InvoiceRecord } from './types';

// Parse an imported file (JSON or CSV)
export const parseImportedFile = async (file: File): Promise<any> => {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing imported file:', error);
    throw new Error('Invalid file format. Please ensure the file is valid JSON.');
  }
};

// Import clients
export const importClients = async (clients: Partial<ClientRecord>[]): Promise<void> => {
  // Validate client data
  const { isValid, errors, data: validData } = validateClientData(clients);
  
  if (!isValid) {
    console.error('Invalid client data:', errors);
    throw new Error(`Invalid client data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing clients by ID to avoid duplicates
  const clientsWithIds = validData.filter(client => client.id);
  const existingIds = await checkExistingItems('clients', clientsWithIds.map(client => client.id as string));
  
  const clientsToInsert = validData.filter(client => !client.id || !existingIds.includes(client.id));
  const clientsToUpdate = validData.filter(client => client.id && existingIds.includes(client.id));
  
  // Insert new clients
  if (clientsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('clients')
      .insert(clientsToInsert);
    
    if (insertError) {
      console.error('Error inserting clients:', insertError);
      throw new Error(`Failed to import clients: ${insertError.message}`);
    }
  }
  
  // Update existing clients
  for (const client of clientsToUpdate) {
    const { error: updateError } = await supabase
      .from('clients')
      .update(client)
      .eq('id', client.id);
    
    if (updateError) {
      console.error(`Error updating client ${client.id}:`, updateError);
    }
  }
};

// Import sites
export const importSites = async (sites: Partial<SiteRecord>[]): Promise<void> => {
  // Validate site data
  const { isValid, errors, data: validData } = validateSiteData(sites);
  
  if (!isValid) {
    console.error('Invalid site data:', errors);
    throw new Error(`Invalid site data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing sites by ID to avoid duplicates
  const sitesWithIds = validData.filter(site => site.id);
  const existingIds = await checkExistingItems('sites', sitesWithIds.map(site => site.id as string));
  
  const sitesToInsert = validData.filter(site => !site.id || !existingIds.includes(site.id));
  const sitesToUpdate = validData.filter(site => site.id && existingIds.includes(site.id));
  
  // Insert new sites
  if (sitesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('sites')
      .insert(sitesToInsert);
    
    if (insertError) {
      console.error('Error inserting sites:', insertError);
      throw new Error(`Failed to import sites: ${insertError.message}`);
    }
  }
  
  // Update existing sites
  for (const site of sitesToUpdate) {
    const { error: updateError } = await supabase
      .from('sites')
      .update(site)
      .eq('id', site.id);
    
    if (updateError) {
      console.error(`Error updating site ${site.id}:`, updateError);
    }
  }
};

// Import contracts
export const importContracts = async (contracts: Partial<ContractHistoryEntry>[]): Promise<void> => {
  // Validate contract data
  const { isValid, errors, data: validData } = validateContractData(contracts);
  
  if (!isValid) {
    console.error('Invalid contract data:', errors);
    throw new Error(`Invalid contract data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing contracts by ID to avoid duplicates
  const contractsWithIds = validData.filter(contract => contract.id);
  const existingIds = await checkExistingItems('site_contract_history', contractsWithIds.map(contract => contract.id as string));
  
  const contractsToInsert = validData.filter(contract => !contract.id || !existingIds.includes(contract.id));
  const contractsToUpdate = validData.filter(contract => contract.id && existingIds.includes(contract.id));
  
  // Insert new contracts
  if (contractsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('site_contract_history')
      .insert(contractsToInsert.map(contract => ({
        site_id: contract.site_id,
        contract_details: contract.contract_details,
        notes: contract.notes || '',
        version_number: 0 // This will be set by the database trigger
      })));
    
    if (insertError) {
      console.error('Error inserting contracts:', insertError);
      throw new Error(`Failed to import contracts: ${insertError.message}`);
    }
  }
  
  // Update existing contracts
  for (const contract of contractsToUpdate) {
    // For site_contract_history, updates might not be appropriate since they're versioned
    // You might want to insert a new version instead of updating
    console.warn('Updating existing contract histories is not recommended. Consider inserting a new version instead.');
    
    const { error: updateError } = await supabase
      .from('site_contract_history')
      .update({
        contract_details: contract.contract_details,
        notes: contract.notes || ''
      })
      .eq('id', contract.id);
    
    if (updateError) {
      console.error(`Error updating contract ${contract.id}:`, updateError);
    }
  }
};

// Import invoices
export const importInvoices = async (invoices: InvoiceRecord[]): Promise<void> => {
  try {
    // Validate invoice data
    const { isValid, errors, data: validData } = validateInvoiceData(invoices);
    
    if (!isValid) {
      console.error('Invalid invoice data:', errors);
      throw new Error(`Invalid invoice data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
    }
    
    // Check for existing invoices by ID to avoid duplicates
    const invoicesWithIds = validData.filter(invoice => invoice.id);
    const existingIds = await checkExistingItems('invoices', invoicesWithIds.map(invoice => invoice.id as string));
    
    const invoicesToInsert = validData.filter(invoice => !invoice.id || !existingIds.includes(invoice.id as string));
    const invoicesToUpdate = validData.filter(invoice => invoice.id && existingIds.includes(invoice.id as string));
    
    // Insert new invoices
    if (invoicesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('invoices')
        .insert(invoicesToInsert);
      
      if (insertError) {
        console.error('Error inserting invoices:', insertError);
        throw new Error(`Failed to import invoices: ${insertError.message}`);
      }
    }
    
    // Update existing invoices
    for (const invoice of invoicesToUpdate) {
      const { error: updateError } = await supabase
        .from('invoices')
        .update(invoice)
        .eq('id', invoice.id);
      
      if (updateError) {
        console.error(`Error updating invoice ${invoice.id}:`, updateError);
      }
    }
    
    // Process invoice line items if they exist
    for (const invoice of invoices) {
      if (invoice.lineItems && Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0) {
        // For each invoice, process its line items
        await importInvoiceLineItems(invoice.id as string, invoice.lineItems);
      }
    }
    
  } catch (error) {
    console.error('Error importing invoices:', error);
    throw error;
  }
};

// Helper function to import invoice line items
const importInvoiceLineItems = async (invoiceId: string, lineItems: any[]): Promise<void> => {
  try {
    // Validate line items
    const { isValid, errors, data: validItems } = validateInvoiceLineItemData(
      lineItems.map(item => ({ ...item, invoice_id: invoiceId }))
    );
    
    if (!isValid) {
      console.error(`Invalid line items for invoice ${invoiceId}:`, errors);
      return;
    }
    
    // First, get existing line items for this invoice
    const { data: existingLineItems, error: fetchError } = await supabase
      .from('invoice_line_items')
      .select('id')
      .eq('invoice_id', invoiceId);
    
    if (fetchError) {
      console.error(`Error fetching line items for invoice ${invoiceId}:`, fetchError);
      return;
    }
    
    const existingIds = existingLineItems?.map(item => item.id) || [];
    
    // Filter items to insert vs update
    const itemsToInsert = validItems.filter(item => !item.id || !existingIds.includes(item.id as string));
    const itemsToUpdate = validItems.filter(item => item.id && existingIds.includes(item.id as string));
    
    // Insert new items
    if (itemsToInsert.length > 0) {
      const preparedItems = itemsToInsert.map(item => ({
        ...item,
        invoice_id: invoiceId
      }));
      
      const { error: insertError } = await supabase
        .from('invoice_line_items')
        .insert(preparedItems);
      
      if (insertError) {
        console.error(`Error inserting line items for invoice ${invoiceId}:`, insertError);
      }
    }
    
    // Update existing items
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from('invoice_line_items')
        .update(item)
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`Error updating line item ${item.id}:`, updateError);
      }
    }
    
  } catch (error) {
    console.error(`Error processing line items for invoice ${invoiceId}:`, error);
  }
};
