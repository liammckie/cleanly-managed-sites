import { parse } from 'papaparse';
import { ClientRecord, SiteRecord, ContractorRecord } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { convertCSVToClientFormat, convertCSVToSiteFormat, convertCSVToContractFormat, convertCSVToContractorFormat } from './fileFormatConversion';

/**
 * Parses a CSV file and returns the data as an array of objects
 */
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    parse(file, {
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

/**
 * Imports clients into the database
 */
export const importClients = async (clients: any[]): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert(clients);
    
    if (error) {
      console.error('Error importing clients:', error);
      return { success: false, message: 'Failed to import clients', error };
    }
    
    return { success: true, message: 'Clients imported successfully', data };
  } catch (error) {
    console.error('Error importing clients:', error);
    return { success: false, message: 'Failed to import clients', error };
  }
};

/**
 * Imports sites into the database
 */
export const importSites = async (sites: any[]): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert(sites);
    
    if (error) {
      console.error('Error importing sites:', error);
      return { success: false, message: 'Failed to import sites', error };
    }
    
    return { success: true, message: 'Sites imported successfully', data };
  } catch (error) {
    console.error('Error importing sites:', error);
    return { success: false, message: 'Failed to import sites', error };
  }
};

/**
 * Imports contracts into the database
 */
export const importContracts = async (contracts: any[]): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .insert(contracts);
    
    if (error) {
      console.error('Error importing contracts:', error);
      return { success: false, message: 'Failed to import contracts', error };
    }
    
    return { success: true, message: 'Contracts imported successfully', data };
  } catch (error) {
    console.error('Error importing contracts:', error);
    return { success: false, message: 'Failed to import contracts', error };
  }
};

/**
 * Imports contractors into the database
 */
export const importContractors = async (contractors: any[]): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .insert(contractors);
    
    if (error) {
      console.error('Error importing contractors:', error);
      return { success: false, message: 'Failed to import contractors', error };
    }
    
    return { success: true, message: 'Contractors imported successfully', data };
  } catch (error) {
    console.error('Error importing contractors:', error);
    return { success: false, message: 'Failed to import contractors', error };
  }
};

/**
 * Sets up test data for development and testing purposes
 */
export const setupTestData = async () => {
  try {
    // Create sample clients
    const clients = [
      {
        name: 'Test Client 1',
        contact_name: 'John Doe',
        email: 'john@test.com',
        phone: '555-1234',
        address: '123 Test St',
        city: 'Testville',
        state: 'TS',
        postcode: '12345',
        status: 'active'
      },
      {
        name: 'Test Client 2',
        contact_name: 'Jane Smith',
        email: 'jane@test.com',
        phone: '555-5678',
        address: '456 Sample Ave',
        city: 'Exampleburg',
        state: 'EX',
        postcode: '67890',
        status: 'active'
      }
    ];
    
    // Create sample sites
    const sites = [
      {
        name: 'Test Site 1',
        address: '123 Test Site St',
        city: 'Testville',
        state: 'TS',
        postcode: '12345',
        status: 'active'
      },
      {
        name: 'Test Site 2',
        address: '456 Sample Site Rd',
        city: 'Exampleburg',
        state: 'EX',
        postcode: '67890',
        status: 'active'
      }
    ];
    
    return {
      clients,
      sites,
      success: true,
      message: 'Test data created successfully'
    };
  } catch (error) {
    console.error('Error creating test data:', error);
    return {
      success: false,
      message: 'Failed to create test data',
      error
    };
  }
};
