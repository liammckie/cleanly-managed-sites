
import { supabase } from '../supabase';
import { validateClientData } from './validation/clientValidation';
import { validateSiteData } from './validation/siteValidation';
import { validateContractData } from './validation/contractValidation';
import { validateContractorData } from './validation/contractorValidation';
import { checkExistingItems } from './validation/commonValidation';

// Parse CSV function
export const parseCSV = async (file: File): Promise<any[]> => {
  // Implementation
  return []; // Placeholder
};

// Import clients
export const importClients = async (clients: any[]): Promise<void> => {
  // Validate client data
  const { isValid, errors, data: validData } = validateClientData(clients);
  
  if (!isValid) {
    console.error('Invalid client data:', errors);
    throw new Error(`Invalid client data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing clients by ID to avoid duplicates
  const clientsWithIds = validData.filter(client => client.id);
  const existingIds = await checkExistingItems('clients', clientsWithIds.map(client => client.id as string));
  
  const clientsToInsert = validData.filter(client => !client.id || !existingIds.includes(client.id as string));
  const clientsToUpdate = validData.filter(client => client.id && existingIds.includes(client.id as string));
  
  // Insert new clients
  if (clientsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('clients')
      .insert(clientsToInsert);
    
    if (insertError) {
      console.error('Error inserting clients:', insertError);
      throw new Error(`Failed to import clients: ${insertError.message}`);
    }
  }
  
  // Update existing clients
  for (const client of clientsToUpdate) {
    const { error: updateError } = await supabase
      .from('clients')
      .update(client)
      .eq('id', client.id);
    
    if (updateError) {
      console.error(`Error updating client ${client.id}:`, updateError);
    }
  }
};

// Import sites
export const importSites = async (sites: any[]): Promise<void> => {
  // Similar implementation to importClients
  const { isValid, errors } = validateSiteData(sites);
  
  if (!isValid) {
    throw new Error(`Invalid site data: ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Implementation...
};

// Import contracts
export const importContracts = async (contracts: any[]): Promise<void> => {
  // Similar implementation to importClients
  const { isValid, errors } = validateContractData(contracts);
  
  if (!isValid) {
    throw new Error(`Invalid contract data: ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Implementation...
};

// Import contractors
export const importContractors = async (contractors: any[]): Promise<void> => {
  // Similar implementation to importClients
  const { isValid, errors } = validateContractorData(contractors);
  
  if (!isValid) {
    throw new Error(`Invalid contractor data: ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Implementation...
};

// Setup test data (will be used by useTestData hook)
export const setupTestData = async (): Promise<any> => {
  // Generate sample data for testing
  const testClients = [
    {
      name: 'Test Client 1',
      contact_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      status: 'active'
    },
    {
      name: 'Test Client 2',
      contact_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
      address: '456 Church St',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      status: 'active'
    }
  ];
  
  const testSites = [
    {
      name: 'Test Site 1',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      status: 'active'
    },
    {
      name: 'Test Site 2',
      address: '456 Church St',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      status: 'active'
    }
  ];
  
  try {
    // Simulate success of test data creation
    return {
      clients: testClients,
      sites: testSites,
      success: true,
      message: 'Test data created successfully',
      createTestClients: async () => testClients,
      createTestSites: async () => testSites,
      createTestContracts: async () => []
    };
  } catch (error: any) {
    console.error('Error setting up test data:', error);
    return {
      success: false,
      error: error.message,
      clients: [],
      sites: []
    };
  }
};

// Format conversion functions can be moved to fileFormatConversion.ts to avoid duplication
