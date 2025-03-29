
import { supabase } from '@/lib/supabase';
import { ImportOptions, ImportResult } from './types';
import { processClientImport } from './clientImport';
import { importSites } from './siteImport';
import { importContractors } from './contractorImport';
import { importContracts } from './contractImport';

// Generic function to check if entities exist in the database
export async function checkExistingEntities(
  tableName: string,
  field: string,
  values: string[]
): Promise<string[]> {
  if (!values.length) return [];

  try {
    // List of known tables for type safety
    const knownTables = [
      'business_locations', 'contractors', 'sites', 'work_orders', 'invoices', 
      'clients', 'quotes', 'user_roles', 'subcontractors', 'allowances', 
      'business_details', 'business_documents', 'contacts', 'contractor_documents',
      'contractor_history', 'contractor_payments', 'contractor_site_assignments',
      'invoice_line_items', 'overhead_profiles', 'quote_shifts', 'quote_subcontractors',
      'site_additional_contracts', 'site_billing_lines', 'site_contract_history',
      'user_integrations', 'user_profiles'
    ];
    
    // Safety check
    if (!knownTables.includes(tableName)) {
      console.error(`Unknown table: ${tableName}`);
      return [];
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select(field)
      .in(field, values);

    if (error) {
      console.error(`Error checking existing ${tableName}:`, error);
      return [];
    }

    return data.map(item => item[field]);
  } catch (error) {
    console.error(`Error in checkExistingEntities for ${tableName}:`, error);
    return [];
  }
}

// Import clients
export async function importClients(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  return processClientImport(data);
}

// Import sites
export async function importSites(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  return importSites(data);
}

// Import contractors
export async function importContractors(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  return importContractors(data);
}

// Import contracts
export async function importContracts(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  return importContracts(data);
}

// Import invoices
export async function importInvoices(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  // This would be implemented similar to other import functions
  return {
    success: false,
    message: 'Invoice import not yet implemented',
    count: 0
  };
}

// Generic import based on type
export async function importData(
  type: 'client' | 'site' | 'contractor' | 'contract' | 'invoice',
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  switch (type) {
    case 'client':
      return importClients(data, options);
    case 'site':
      return importSites(data, options);
    case 'contractor':
      return importContractors(data, options);
    case 'contract':
      return importContracts(data, options);
    case 'invoice':
      return importInvoices(data, options);
    default:
      return {
        success: false,
        message: `Unknown import type: ${type}`,
        count: 0
      };
  }
}
