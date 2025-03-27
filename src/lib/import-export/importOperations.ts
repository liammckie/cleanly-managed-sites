
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  validateClientData, 
  validateSiteData, 
  validateContractorData, 
  validateContractData,
  validateInvoiceData
} from './validation';
import { 
  ImportOptions, 
  ImportResult, 
  DataType 
} from './types';

/**
 * Generic import function that can handle different entity types
 * @param data The data to import
 * @param type The type of data (client, site, etc.)
 * @param options Import options
 * @returns Import result
 */
export async function importData<T>(
  data: any[],
  type: DataType,
  options: ImportOptions = {}
): Promise<ImportResult> {
  try {
    // Validate the data based on type
    let validationResult: any;
    
    switch (type) {
      case 'client':
        validationResult = validateClientData(data);
        break;
      case 'site':
        validationResult = validateSiteData(data);
        break;
      case 'contractor':
        validationResult = validateContractorData(data);
        break;
      case 'contract':
        validationResult = validateContractData(data);
        break;
      case 'invoice':
        validationResult = validateInvoiceData(data);
        break;
      default:
        return {
          success: false,
          message: `Unsupported data type: ${type}`,
          count: 0
        };
    }
    
    if (!validationResult.valid) {
      return {
        success: false,
        message: `Validation failed for ${type} import`,
        count: 0,
        failures: validationResult.errors
      };
    }
    
    // If dry run, return success without inserting
    if (options.dryRun) {
      return {
        success: true,
        message: `Dry run completed for ${type} import`,
        count: validationResult.data?.length || 0,
        data: validationResult.data
      };
    }
    
    // Insert the data into the database
    const table = getTableNameForType(type);
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(validationResult.data)
      .select();
    
    if (error) {
      console.error(`Error importing ${type}:`, error);
      return {
        success: false,
        message: error.message,
        count: 0,
        failures: [{ message: error.message }]
      };
    }
    
    return {
      success: true,
      message: `Successfully imported ${insertedData?.length || 0} ${type}(s)`,
      count: insertedData?.length || 0,
      data: insertedData
    };
  } catch (error) {
    console.error(`Error during ${type} import:`, error);
    return {
      success: false,
      message: (error as Error).message,
      count: 0,
      failures: [{ message: (error as Error).message }]
    };
  }
}

/**
 * Gets the table name for a data type
 * @param type The data type
 * @returns The table name
 */
function getTableNameForType(type: DataType): string {
  switch (type) {
    case 'client':
      return 'clients';
    case 'site':
      return 'sites';
    case 'contractor':
      return 'contractors';
    case 'contract':
      return 'site_contract_history';
    case 'invoice':
      return 'invoices';
    default:
      throw new Error(`Unsupported data type: ${type}`);
  }
}

// Specific import functions for different entity types
export const importClients = (data: any[], options?: ImportOptions) => 
  importData(data, 'client', options);

export const importSites = (data: any[], options?: ImportOptions) => 
  importData(data, 'site', options);

export const importContractors = (data: any[], options?: ImportOptions) => 
  importData(data, 'contractor', options);

export const importContracts = (data: any[], options?: ImportOptions) => 
  importData(data, 'contract', options);

export const importInvoices = (data: any[], options?: ImportOptions) => 
  importData(data, 'invoice', options);
