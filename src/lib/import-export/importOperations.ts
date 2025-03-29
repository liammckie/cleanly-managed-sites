
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { validateWithZod } from '@/lib/validation';
import { ImportOptions, ImportResult } from './types';
import { processClientImport } from './clientImport';
import { processSiteImport } from './siteImport';
import { processContractorImport } from './contractorImport';
import { processContractImport } from './contractImport';
import { processInvoiceImport } from './invoiceImport';

/**
 * Generic import function that delegates to specific import implementations
 */
export async function importData(
  data: any[],
  tableName: string,
  options: ImportOptions = {}
): Promise<ImportResult> {
  console.log(`Starting import for ${tableName}`, { data, options });
  
  try {
    switch (tableName) {
      case 'clients':
        return await processClientImport(data, options);
      case 'sites':
        return await processSiteImport(data, options);
      case 'contractors':
        return await processContractorImport(data, options);
      case 'contracts':
        return await processContractImport(data, options);
      case 'invoices':
        return await processInvoiceImport(data, options);
      default:
        return await genericImport(data, tableName, options);
    }
  } catch (error: any) {
    console.error(`Error during import to ${tableName}:`, error);
    toast.error(`Import failed: ${error.message || 'Unknown error'}`);
    
    return {
      success: false,
      message: `Import failed: ${error.message || 'Unknown error'}`,
      count: 0,
      failures: [error]
    };
  }
}

/**
 * Generic import implementation for tables without specialized logic
 */
async function genericImport(
  data: any[],
  tableName: string,
  options: ImportOptions
): Promise<ImportResult> {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: 'No data to import',
      count: 0
    };
  }
  
  try {
    // Use the actual table name for the insertion
    const { data: insertedData, error } = await supabase
      .from(tableName as any)
      .insert(data);
      
    if (error) throw error;
    
    return {
      success: true,
      message: `Successfully imported ${data.length} records to ${tableName}`,
      count: data.length,
      data: insertedData
    };
  } catch (error: any) {
    console.error(`Error importing data to ${tableName}:`, error);
    
    return {
      success: false,
      message: `Import failed: ${error.message}`,
      count: 0,
      failures: [error]
    };
  }
}

// Export specific import functions for direct use
export const importClients = processClientImport;
export const importSites = processSiteImport;
export const importContractors = processContractorImport;
export const importContracts = processContractImport;
export const importInvoices = processInvoiceImport;
