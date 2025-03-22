
import { supabase } from '../supabase';
import { toast } from 'sonner';

// Function to generate test data for validation purposes
export const generateTestData = () => {
  // Sample client data
  const testClients = [
    {
      name: "ACME Corporation",
      contact_name: "John Doe",
      email: "john@acme.com",
      phone: "123-456-7890",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postcode: "10001",
      status: "active",
      notes: "Test client for import validation",
      custom_id: "TEST-CL001"
    },
    {
      name: "XYZ Enterprises",
      contact_name: "Jane Smith",
      email: "jane@xyz.com",
      phone: "987-654-3210",
      address: "456 Business Ave",
      city: "Chicago",
      state: "IL",
      postcode: "60601",
      status: "pending",
      notes: "Test client with pending status",
      custom_id: "TEST-CL002"
    }
  ];
  
  // Sample site data (requires valid client_id)
  const testSites = [
    {
      name: "ACME Headquarters",
      address: "123 Main St, Suite 100",
      city: "New York",
      state: "NY",
      postcode: "10001",
      status: "active",
      representative: "John Doe",
      phone: "123-456-7890",
      email: "site@acme.com",
      client_id: "[CLIENT_ID_1]", // To be replaced with actual client ID
      custom_id: "TEST-ST001",
      monthly_cost: 1000,
      monthly_revenue: 1500
    },
    {
      name: "XYZ Office",
      address: "456 Business Ave, Floor 2",
      city: "Chicago",
      state: "IL",
      postcode: "60601",
      status: "active",
      representative: "Jane Smith",
      phone: "987-654-3210",
      email: "site@xyz.com",
      client_id: "[CLIENT_ID_2]", // To be replaced with actual client ID
      custom_id: "TEST-ST002",
      monthly_cost: 800,
      monthly_revenue: 1200
    }
  ];
  
  // Sample contract data (requires valid site_id)
  const testContracts = [
    {
      site_id: "[SITE_ID_1]", // To be replaced with actual site ID
      contract_details: {
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        contractNumber: "TEST-CNT-001",
        renewalTerms: "30 days automatic renewal",
        terminationPeriod: "60 days written notice",
        terms: []
      },
      notes: "Test contract for import validation",
      version_number: 1
    },
    {
      site_id: "[SITE_ID_2]", // To be replaced with actual site ID
      contract_details: {
        startDate: "2023-06-15",
        endDate: "2024-06-14",
        contractNumber: "TEST-CNT-002",
        renewalTerms: "60 days review period",
        terminationPeriod: "90 days written notice",
        terms: []
      },
      notes: "Test contract with different terms",
      version_number: 1
    }
  ];
  
  return {
    clients: testClients,
    sites: testSites,
    contracts: testContracts
  };
};

// Setup test data in the database
export const setupTestData = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to set up test data');
    }
    
    const testData = generateTestData();
    
    const { data: clients } = await supabase
      .from('clients')
      .insert(testData.clients.map(client => ({
        ...client,
        user_id: user.id
      })))
      .select();
    
    if (!clients || clients.length === 0) {
      throw new Error('Failed to create test clients');
    }
    
    const sitesWithClientIds = testData.sites.map((site, index) => ({
      ...site,
      client_id: clients[Math.min(index, clients.length - 1)].id,
      user_id: user.id
    }));
    
    const { data: sites } = await supabase
      .from('sites')
      .insert(sitesWithClientIds)
      .select();
    
    if (!sites || sites.length === 0) {
      throw new Error('Failed to create test sites');
    }
    
    const contractsWithSiteIds = testData.contracts.map((contract, index) => ({
      ...contract,
      site_id: sites[Math.min(index, sites.length - 1)].id,
      created_by: user.id
    }));
    
    for (const contract of contractsWithSiteIds) {
      await supabase
        .from('site_contract_history')
        .insert(contract);
      
      await supabase
        .from('sites')
        .update({ contract_details: contract.contract_details })
        .eq('id', contract.site_id);
    }
    
    toast.success('Test data set up successfully!');
  } catch (error: any) {
    console.error('Error setting up test data:', error);
    toast.error(`Failed to set up test data: ${error.message}`);
  }
};
