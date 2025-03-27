
import { supabase } from '@/integrations/supabase/client';
import { parseJson, convertJsonToType } from '@/lib/utils/json';
import * as validation from './validation';
import { getUserId } from '@/lib/auth';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data: any[];
}

interface ImportOptions {
  mode: 'full' | 'incremental';
}

/**
 * Parse a CSV file to JSON
 */
export const parseCSV = async (file: File): Promise<any[]> => {
  if (!file) return [];
  
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, any> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });
  
  return rows;
};

/**
 * Import clients from CSV
 */
export const importClients = async (data: any[], options: ImportOptions = { mode: 'incremental' }): Promise<ValidationResult> => {
  const validationResult = validation.validateClientData(data);
  if (!validationResult.isValid) {
    return validationResult;
  }
  
  const userId = await getUserId();
  
  const processedData = validationResult.data.map(client => ({
    ...client,
    user_id: userId
  }));
  
  const { data: result, error } = await supabase
    .from('clients')
    .upsert(processedData);
    
  if (error) {
    console.error('Error importing clients:', error);
    return {
      isValid: false,
      errors: [error.message],
      data: []
    };
  }
  
  return {
    isValid: true,
    errors: [],
    data: result || []
  };
};

/**
 * Import sites from CSV
 */
export const importSites = async (data: any[], options: ImportOptions = { mode: 'incremental' }): Promise<ValidationResult> => {
  const validationResult = validation.validateSiteData(data);
  if (!validationResult.isValid) {
    return validationResult;
  }
  
  const userId = await getUserId();
  
  const processedData = validationResult.data.map(site => ({
    ...site,
    user_id: userId,
    representative: site.representative || 'Site Manager',
  }));
  
  const { data: result, error } = await supabase
    .from('sites')
    .upsert(processedData);
    
  if (error) {
    console.error('Error importing sites:', error);
    return {
      isValid: false,
      errors: [error.message],
      data: []
    };
  }
  
  return {
    isValid: true,
    errors: [],
    data: result || []
  };
};

/**
 * Import contractors from CSV
 */
export const importContractors = async (data: any[], options: ImportOptions = { mode: 'incremental' }): Promise<ValidationResult> => {
  const validationResult = validation.validateContractorData(data);
  if (!validationResult.isValid) {
    return validationResult;
  }
  
  const userId = await getUserId();
  
  const processedData = validationResult.data.map(contractor => ({
    ...contractor,
    user_id: userId,
    contractor_type: contractor.contractor_type || 'company',
  }));
  
  const { data: result, error } = await supabase
    .from('contractors')
    .upsert(processedData);
    
  if (error) {
    console.error('Error importing contractors:', error);
    return {
      isValid: false,
      errors: [error.message],
      data: []
    };
  }
  
  return {
    isValid: true,
    errors: [],
    data: result || []
  };
};

/**
 * Setup test data for development purposes
 */
export const setupTestData = async (): Promise<void> => {
  // This would generate and insert sample data for testing
  console.log('Setting up test data...');
  // Implementation would depend on the specific test data needed
};

/**
 * Converts CSV format to client format
 */
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || row.company_name || '',
    contact_name: row.contact_name || row.contact || '',
    email: row.email || '',
    phone: row.phone || row.telephone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    status: row.status || 'active',
    notes: row.notes || '',
    custom_id: row.custom_id || row.id || '',
  }));
};

/**
 * Converts CSV format to site format
 */
export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || row.site_name || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    country: row.country || 'Australia',
    client_id: row.client_id || '',
    client_name: row.client_name || '',
    status: row.status || 'active',
    email: row.email || '',
    phone: row.phone || '',
    representative: row.representative || row.site_manager || 'Site Manager',
    custom_id: row.custom_id || row.id || '',
  }));
};

/**
 * Converts CSV format to contractor format
 */
export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    business_name: row.business_name || row.company || '',
    contact_name: row.contact_name || row.contact || '',
    email: row.email || '',
    phone: row.phone || row.telephone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || row.postal_code || row.zip || '',
    status: row.status || 'active',
    notes: row.notes || '',
    tax_id: row.tax_id || row.abn || '',
    contractor_type: row.contractor_type || 'company',
  }));
};

/**
 * Converts CSV format to contract format
 */
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => {
    const contractDetails = {
      contractNumber: row.contract_number || '',
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      autoRenewal: row.auto_renewal === 'true' || row.auto_renewal === true,
      renewalPeriod: parseInt(row.renewal_period || '0', 10),
      renewalNotice: parseInt(row.renewal_notice || '0', 10),
      noticeUnit: row.notice_unit || 'days',
      terminationPeriod: row.termination_period || '',
    };
    
    return {
      site_id: row.site_id || '',
      contract_details: contractDetails,
      status: row.status || 'active',
      monthly_revenue: parseFloat(row.monthly_revenue || '0'),
    };
  });
};

/**
 * Handle unified data import
 */
export const handleUnifiedImport = async (importData: any, type: string, options: ImportOptions): Promise<ValidationResult> => {
  switch (type) {
    case 'clients':
      return importClients(importData, options);
    case 'sites':
      return importSites(importData, options);
    case 'contractors':
      return importContractors(importData, options);
    default:
      return {
        isValid: false,
        errors: [`Unknown import type: ${type}`],
        data: []
      };
  }
};
