import { supabase } from '@/lib/supabase';
import { parseCsvToJson } from './csvParser';
import { parseJsonToCsv } from './csvExporter';
import { 
  validateClientData, 
  validateSiteData, 
  validateContractorData 
} from './validation';
import { ClientRecord, SiteRecord, ContractorRecord } from '@/lib/types';
import { toast } from 'sonner';

export async function importDataFromFile(file: File, type: 'clients' | 'sites' | 'contractors'): Promise<any[]> {
  if (!file) throw new Error('No file provided');
  
  try {
    // Read the file and parse it
    const fileContents = await readFileAsText(file);
    const parsedData = await parseCsvToJson(fileContents);
    
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

export async function saveImportedData(data: any[], type: 'clients' | 'sites' | 'contractors'): Promise<void> {
  if (!data || data.length === 0) return;
  
  try {
    // Add user_id to each record
    const user = supabase.auth.getUser();
    const recordsWithUserId = data.map(record => ({
      ...record,
      user_id: user || 'system'
    }));
    
    // Use a different table based on the type
    let response;
    
    switch (type) {
      case 'clients':
        response = await supabase.from('clients').insert(recordsWithUserId as any);
        break;
      case 'sites':
        response = await supabase.from('sites').insert(recordsWithUserId as any);
        break;
      case 'contractors':
        response = await supabase.from('contractors').insert(recordsWithUserId as any);
        break;
    }
    
    if (response?.error) {
      throw new Error(response.error.message);
    }
    
    toast.success(`Successfully imported ${data.length} ${type}`);
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
    toast.error(`Failed to save imported ${type}: ${(error as Error).message}`);
    throw error;
  }
}

export async function exportData(type: 'clients' | 'sites' | 'contractors'): Promise<string> {
  try {
    let data: any[] = [];
    let response;
    
    switch (type) {
      case 'clients':
        response = await supabase.from('clients').select('*');
        break;
      case 'sites':
        response = await supabase.from('sites').select('*');
        break;
      case 'contractors':
        response = await supabase.from('contractors').select('*');
        break;
    }
    
    if (response?.error) {
      throw new Error(response.error.message);
    }
    
    data = response?.data || [];
    return parseJsonToCsv(data);
  } catch (error) {
    console.error(`Error exporting ${type}:`, error);
    throw error;
  }
}

export function setupTestData() {
  // This is a placeholder for the actual implementation
  console.log("Setting up test data...");
  return Promise.resolve();
}

export function handleUnifiedImport(file: File, type: string) {
  // This is a placeholder for the actual implementation
  console.log(`Handling unified import for ${type}...`);
  return Promise.resolve(true);
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
