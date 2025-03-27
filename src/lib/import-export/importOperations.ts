
import { supabase } from '@/lib/supabase';
import { 
  validateClientData, 
  validateSiteData, 
  validateContractData, 
  validateContractorData, 
  validateInvoiceData
} from './validation';

import {
  ClientImportItem,
  ContractorRecord
} from './types';

import { SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Define valid table names to improve type safety
type ValidTableName = 'clients' | 'contractors' | 'sites' | 'site_contract_history' | 'invoices';

// Base functions for importing data
export async function importData<T extends Record<string, any>>(
  tableName: ValidTableName, 
  data: T[]
): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> {
  if (!data || data.length === 0) {
    return {
      success: false,
      count: 0,
      errors: [{ message: 'No data to import' }]
    };
  }
  
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        count: 0,
        errors: [{ message: 'You must be logged in to import data' }]
      };
    }
    
    // Add user_id to each record
    const dataWithUserId = data.map(item => ({
      ...item,
      user_id: user.id
    }));
    
    // Use explicit table name with type assertion
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(dataWithUserId as any)
      .select();
    
    if (error) {
      console.error(`Error importing data to ${tableName}:`, error);
      return {
        success: false,
        count: 0,
        errors: [{ message: error.message }]
      };
    }
    
    return {
      success: true,
      count: insertedData?.length || dataWithUserId.length
    };
    
  } catch (error) {
    console.error(`Error importing data to ${tableName}:`, error);
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
}

// Specific import functions
export async function importClients(
  clientsData: any[]
): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> {
  try {
    // Validate the data
    const validation = validateClientData(clientsData);
    if (!validation.valid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors
      };
    }
    
    const validClients = validation.data || [];
    return importData('clients', validClients);
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
}

export async function importContractors(
  contractorsData: any[]
): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> {
  try {
    // Validate the data
    const validation = validateContractorData(contractorsData);
    if (!validation.valid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors
      };
    }
    
    const validContractors = validation.data || [];
    return importData('contractors', validContractors);
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
}

export async function importSites(
  sitesData: any[]
): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> {
  try {
    // Validate the data
    const validation = validateSiteData(sitesData);
    if (!validation.valid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors
      };
    }
    
    const validSites = validation.data || [];
    return importData('sites', validSites);
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
}

export async function importContracts(
  contractsData: any[]
): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> {
  try {
    // Validate the data
    const validation = validateContractData(contractsData);
    if (!validation.valid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors
      };
    }
    
    const validContracts = validation.data || [];
    return importData('site_contract_history', validContracts);
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
}

export async function importInvoices(
  invoicesData: any[]
): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> {
  try {
    // Validate the data
    const validation = validateInvoiceData(invoicesData);
    if (!validation.valid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors
      };
    }
    
    const validInvoices = validation.data || [];
    return importData('invoices', validInvoices);
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
}
