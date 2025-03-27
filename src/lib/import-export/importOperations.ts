
import { supabase } from '@/lib/supabase';

// Define valid table names to improve type safety
type ValidTableName = 'clients' | 'contractors' | 'sites' | 'site_additional_contracts';

// Base functions for importing data
export async function importData<T extends Record<string, any>>(tableName: ValidTableName, data: T[]): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error('No data to import');
  }
  
  // Get the current user ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to import data');
  }
  
  // Add user_id to each record
  const dataWithUserId = data.map(item => ({
    ...item,
    user_id: user.id
  }));
  
  // Use explicit table name with type assertion
  const { error } = await supabase
    .from(tableName as any)
    .insert(dataWithUserId as any);
  
  if (error) {
    console.error(`Error importing data to ${tableName}:`, error);
    throw error;
  }
}

// Specific import functions
export async function importClients(clients: any[]): Promise<void> {
  return importData('clients', clients);
}

export async function importContractors(contractors: any[]): Promise<void> {
  return importData('contractors', contractors);
}

export async function importSites(sites: any[]): Promise<void> {
  return importData('sites', sites);
}

export async function importContracts(contracts: any[]): Promise<void> {
  return importData('site_additional_contracts', contracts);
}
