
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { get } from 'lodash';

// Function to parse CSV files
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Convert CSV data to client format
export const convertCSVToClientFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || '',
    contact_name: row.contact_name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || '',
    country: row.country || 'Australia',
    status: row.status || 'active',
    user_id: get(supabase.auth.getUser(), 'data.user.id'),
  }));
};

// Import clients to the database
export const importClients = async (clientsData: any[]): Promise<any> => {
  try {
    // Add user_id to each client if not present
    const userId = get(supabase.auth.getUser(), 'data.user.id');
    const clientsWithUserId = clientsData.map(client => ({
      ...client,
      user_id: client.user_id || userId,
    }));
    
    const { data, error } = await supabase
      .from('clients')
      .insert(clientsWithUserId);

    if (error) {
      console.error('Error inserting clients:', error);
      return { 
        success: false, 
        message: error.message,
        errorDetails: error 
      };
    }

    return { success: true, count: clientsData.length };
  } catch (error: any) {
    console.error('Error importing clients:', error);
    return { 
      success: false, 
      message: error.message,
      errorDetails: error 
    };
  }
};

// Convert CSV data to site format
export const convertCSVToSiteFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    name: row.name || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || '',
    country: row.country || 'Australia',
    client_id: row.client_id || '',
    status: row.status || 'active',
    email: row.email || '',
    phone: row.phone || '',
    representative: row.representative || 'Site Manager',
    user_id: get(supabase.auth.getUser(), 'data.user.id'),
  }));
};

// Import sites to the database
export const importSites = async (sitesData: any[]): Promise<any> => {
  try {
    // Add user_id and representative to each site if not present
    const userId = get(supabase.auth.getUser(), 'data.user.id');
    const sitesWithUserId = sitesData.map(site => ({
      ...site,
      user_id: site.user_id || userId,
      representative: site.representative || 'Site Manager',
    }));

    const { data, error } = await supabase
      .from('sites')
      .insert(sitesWithUserId);

    if (error) {
      console.error('Error inserting sites:', error);
      return { 
        success: false, 
        message: error.message,
        errorDetails: error 
      };
    }

    return { success: true, count: sitesData.length };
  } catch (error: any) {
    console.error('Error importing sites:', error);
    return { 
      success: false, 
      message: error.message,
      errorDetails: error 
    };
  }
};

// Function to convert CSV to contractor format
export const convertCSVToContractorFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    business_name: row.business_name || '',
    contact_name: row.contact_name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postcode: row.postcode || '',
    tax_id: row.tax_id || '',
    abn: row.abn || '',
    contractor_type: row.contractor_type || 'cleaning',
    status: row.status || 'active',
    user_id: get(supabase.auth.getUser(), 'data.user.id'),
  }));
};

// Function to import contractors
export const importContractors = async (contractorsData: any[]): Promise<any> => {
  try {
    // Add user_id to each contractor if not present
    const userId = get(supabase.auth.getUser(), 'data.user.id');
    const contractorsWithUserId = contractorsData.map(contractor => ({
      ...contractor,
      user_id: contractor.user_id || userId,
    }));

    const { data, error } = await supabase
      .from('contractors')
      .insert(contractorsWithUserId);

    if (error) {
      console.error('Error inserting contractors:', error);
      return { 
        success: false, 
        message: error.message,
        errorDetails: error 
      };
    }

    return { success: true, count: contractorsData.length };
  } catch (error: any) {
    console.error('Error importing contractors:', error);
    return { 
      success: false, 
      message: error.message,
      errorDetails: error 
    };
  }
};

// Convert CSV data to contract format
export const convertCSVToContractFormat = (csvData: any[]): any[] => {
  return csvData.map(row => ({
    site_id: row.site_id || '',
    contract_number: row.contract_number || '',
    start_date: row.start_date || '',
    end_date: row.end_date || '',
    auto_renew: row.auto_renew === 'true',
    termination_period: row.termination_period || '',
    renewal_terms: row.renewal_terms || '',
    billing_cycle: row.billing_cycle || 'monthly',
    value: parseFloat(row.value) || 0,
    notes: row.notes || '',
    user_id: get(supabase.auth.getUser(), 'data.user.id'),
  }));
};

// Function to import contracts
export const importContracts = async (contractsData: any[]): Promise<any> => {
  try {
    // Add user_id to each contract if not present
    const userId = get(supabase.auth.getUser(), 'data.user.id');
    const contractsWithUserId = contractsData.map(contract => ({
      ...contract,
      user_id: contract.user_id || userId,
    }));

    const { data, error } = await supabase
      .from('site_additional_contracts')
      .insert(contractsWithUserId);

    if (error) {
      console.error('Error inserting contracts:', error);
      return { 
        success: false, 
        message: error.message,
        errorDetails: error 
      };
    }

    return { success: true, count: contractsData.length };
  } catch (error: any) {
    console.error('Error importing contracts:', error);
    return { 
      success: false, 
      message: error.message,
      errorDetails: error 
    };
  }
};
