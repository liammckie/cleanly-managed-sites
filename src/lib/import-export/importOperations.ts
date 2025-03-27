
// Import this module explicitly to avoid circular dependencies
import { supabase } from '@/lib/supabase';

// Base functions for importing data
export async function importData(tableName: string, data: any[]): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error('No data to import');
  }
  
  const { error } = await supabase
    .from(tableName)
    .insert(data);
  
  if (error) {
    console.error(`Error importing data to ${tableName}:`, error);
    throw error;
  }
}

// Specific import functions
export async function importClientsOperation(clients: any[]): Promise<void> {
  return importData('clients', clients);
}

export async function importContractorsOperation(contractors: any[]): Promise<void> {
  return importData('contractors', contractors);
}

export async function importSitesOperation(sites: any[]): Promise<void> {
  return importData('sites', sites);
}

export async function importContractsOperation(contracts: any[]): Promise<void> {
  return importData('site_additional_contracts', contracts);
}
