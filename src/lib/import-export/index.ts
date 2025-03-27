
import { supabase } from '@/lib/supabase';
import { parseCSV, convertCSVToClientFormat, convertCSVToSiteFormat, convertCSVToContractFormat, convertCSVToContractorFormat } from './csvParser';
import { parseJsonToCsv, downloadCsv } from './csvExporter';
import { validateClientData, validateSiteData, validateContractorData } from './validation';
import { ClientRecord, SiteRecord, ContractorRecord } from '@/lib/types';
import { toast } from 'sonner';

export async function parseImportedFile(file: File): Promise<any[]> {
  try {
    const data = await parseCSV(file);
    return data;
  } catch (error) {
    console.error('Error parsing file:', error);
    throw error;
  }
}

export async function importDataFromFile(file: File, type: 'clients' | 'sites' | 'contractors'): Promise<any[]> {
  if (!file) throw new Error('No file provided');
  
  try {
    // Read the file and parse it
    const parsedData = await parseCSV(file);
    
    // Validate the data based on type
    let validatedData: any[] = [];
    
    switch (type) {
      case 'clients':
        validatedData = validateClientData(parsedData);
        break;
      case 'sites':
        validatedData = validateSiteData(parsedData);
        break;
      case 'contractors':
        validatedData = validateContractorData(parsedData);
        break;
    }
    
    return validatedData;
  } catch (error) {
    console.error(`Error importing ${type}:`, error);
    throw error;
  }
}

export async function importClients(data: any[]): Promise<void> {
  if (!data || data.length === 0) return;
  
  const clientsToImport = convertCSVToClientFormat(data);
  
  try {
    // Add user_id to each record
    const user = await supabase.auth.getUser();
    const recordsWithUserId = clientsToImport.map(record => ({
      ...record,
      user_id: user.data?.user?.id || 'system',
      contact_name: record.contact_name || 'Unknown',
      name: record.name || 'Unnamed Client'
    }));
    
    const { error } = await supabase
      .from('clients')
      .insert(recordsWithUserId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    toast.success(`Successfully imported ${data.length} clients`);
  } catch (error) {
    console.error(`Error saving clients:`, error);
    toast.error(`Failed to save imported clients: ${(error as Error).message}`);
    throw error;
  }
}

export async function importSites(data: any[]): Promise<void> {
  if (!data || data.length === 0) return;
  
  const sitesToImport = convertCSVToSiteFormat(data);
  
  try {
    // Add user_id to each record
    const user = await supabase.auth.getUser();
    const recordsWithUserId = sitesToImport.map(record => ({
      ...record,
      user_id: user.data?.user?.id || 'system',
      representative: record.representative || 'Unknown',
      name: record.name || 'Unnamed Site',
      address: record.address || 'No Address',
      city: record.city || 'Unknown',
      state: record.state || 'Unknown',
      postcode: record.postcode || 'Unknown',
      client_id: record.client_id
    }));
    
    const { error } = await supabase
      .from('sites')
      .insert(recordsWithUserId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    toast.success(`Successfully imported ${data.length} sites`);
  } catch (error) {
    console.error(`Error saving sites:`, error);
    toast.error(`Failed to save imported sites: ${(error as Error).message}`);
    throw error;
  }
}

export async function importContractors(data: any[]): Promise<void> {
  if (!data || data.length === 0) return;
  
  const contractorsToImport = convertCSVToContractorFormat(data);
  
  try {
    // Add user_id to each record
    const user = await supabase.auth.getUser();
    const recordsWithUserId = contractorsToImport.map(record => ({
      ...record,
      user_id: user.data?.user?.id || 'system',
      business_name: record.business_name || 'Unknown Company',
      contact_name: record.contact_name || 'Unknown Contact',
      contractor_type: record.contractor_type || 'general'
    }));
    
    const { error } = await supabase
      .from('contractors')
      .insert(recordsWithUserId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    toast.success(`Successfully imported ${data.length} contractors`);
  } catch (error) {
    console.error(`Error saving contractors:`, error);
    toast.error(`Failed to save imported contractors: ${(error as Error).message}`);
    throw error;
  }
}

export async function importContracts(data: any[]): Promise<void> {
  // Implementation for contract imports would go here
  toast.info('Contract import functionality is not fully implemented yet');
  return Promise.resolve();
}

export function setupTestData(): Promise<void> {
  // This is a placeholder for test data setup
  console.log("Setting up test data...");
  return Promise.resolve();
}

export function handleUnifiedImport(file: File, options: any): Promise<boolean> {
  // Placeholder for unified import
  console.log(`Handling unified import with options:`, options);
  return Promise.resolve(true);
}
