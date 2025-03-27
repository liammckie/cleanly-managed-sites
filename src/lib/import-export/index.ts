
import { parseCSV, convertCSVToClientFormat, convertCSVToContractorFormat, convertCSVToSiteFormat, convertCSVToContractFormat } from './csvParser';
import { validateClientData, validateContractorData, validateSiteData, validateContractData } from './validation';
import { supabase } from '@/lib/supabase';
import { ClientRecord, ContractorRecord, SiteRecord } from '@/lib/types';
import { Json } from '@/lib/types';

export type ValidationResult = {
  valid: boolean;
  data: any[];
  errors: string[];
  warnings: string[];
};

/**
 * Handle unified import for various entity types
 */
export async function handleUnifiedImport(file: File, entityType: string, options: { mode: string } | string = 'incremental') {
  try {
    const csvContent = await file.text();
    const parsedData = await parseCSV(csvContent);
    
    // Determine validation and import function based on entity type
    switch (entityType) {
      case 'clients':
        const clientData = convertCSVToClientFormat(parsedData);
        const validatedClientData = validateClientData(clientData);
        
        if (validatedClientData.valid) {
          return await importClients(validatedClientData.data);
        }
        return validatedClientData;
        
      case 'sites':
        const siteData = convertCSVToSiteFormat(parsedData);
        const validatedSiteData = validateSiteData(siteData);
        
        if (validatedSiteData.valid) {
          return await importSites(validatedSiteData.data);
        }
        return validatedSiteData;
        
      case 'contractors':
        const contractorData = convertCSVToContractorFormat(parsedData);
        const validatedContractorData = validateContractorData(contractorData);
        
        if (validatedContractorData.valid) {
          return await importContractors(validatedContractorData.data);
        }
        return validatedContractorData;
        
      case 'contracts':
        const contractData = convertCSVToContractFormat(parsedData);
        const validatedContractData = validateContractData(contractData);
        
        if (validatedContractData.valid) {
          return await importContracts(validatedContractData.data);
        }
        return validatedContractData;
        
      default:
        return {
          valid: false,
          data: [],
          errors: [`Unsupported entity type: ${entityType}`],
          warnings: []
        };
    }
  } catch (error) {
    console.error('Import error:', error);
    return {
      valid: false,
      data: [],
      errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}

/**
 * Import clients from validated data
 */
export async function importClients(clientsData: Partial<ClientRecord>[]) {
  try {
    // Add user_id to each client
    const dataWithUserIds = clientsData.map(client => ({
      ...client,
      user_id: supabase.auth.getUser()?.data?.user?.id
    }));
    
    const { data, error } = await supabase.from('clients').insert(dataWithUserIds);
    
    if (error) {
      return {
        valid: false,
        data: [],
        errors: [error.message],
        warnings: []
      };
    }
    
    return {
      valid: true,
      data: data || [],
      errors: [],
      warnings: []
    };
  } catch (error) {
    console.error('Client import error:', error);
    return {
      valid: false,
      data: [],
      errors: [`Client import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}

/**
 * Import sites from validated data
 */
export async function importSites(sitesData: Partial<SiteRecord>[]) {
  try {
    // Add user_id to each site
    const dataWithUserIds = sitesData.map(site => ({
      ...site,
      user_id: supabase.auth.getUser()?.data?.user?.id,
      representative: 'Imported',
    }));
    
    const { data, error } = await supabase.from('sites').insert(dataWithUserIds);
    
    if (error) {
      return {
        valid: false,
        data: [],
        errors: [error.message],
        warnings: []
      };
    }
    
    return {
      valid: true,
      data: data || [],
      errors: [],
      warnings: []
    };
  } catch (error) {
    console.error('Site import error:', error);
    return {
      valid: false,
      data: [],
      errors: [`Site import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}

/**
 * Import contractors from validated data
 */
export async function importContractors(contractorsData: Partial<ContractorRecord>[]) {
  try {
    // Add user_id to each contractor
    const dataWithUserIds = contractorsData.map(contractor => ({
      ...contractor,
      user_id: supabase.auth.getUser()?.data?.user?.id,
      contractor_type: contractor.contractor_type || 'general'
    }));
    
    const { data, error } = await supabase.from('contractors').insert(dataWithUserIds);
    
    if (error) {
      return {
        valid: false,
        data: [],
        errors: [error.message],
        warnings: []
      };
    }
    
    return {
      valid: true,
      data: data || [],
      errors: [],
      warnings: []
    };
  } catch (error) {
    console.error('Contractor import error:', error);
    return {
      valid: false,
      data: [],
      errors: [`Contractor import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}

/**
 * Import contracts from validated data
 */
export async function importContracts(contractsData: any[]) {
  try {
    // Process contract data - this would need to be implemented
    // based on the structure of the contract data
    
    return {
      valid: true,
      data: [],
      errors: [],
      warnings: ['Contract import not fully implemented yet']
    };
  } catch (error) {
    console.error('Contract import error:', error);
    return {
      valid: false,
      data: [],
      errors: [`Contract import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}

// Export for use in hooks
export { parseCSV, convertCSVToClientFormat, convertCSVToContractorFormat, convertCSVToSiteFormat, convertCSVToContractFormat };
