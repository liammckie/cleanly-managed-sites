
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Create test data for development and demonstration purposes
export async function setupTestData() {
  try {
    // Create test clients
    const clients = await createTestClients();
    
    // Create test sites using the clients
    const sites = await createTestSites(clients);
    
    // Create test contracts for the sites
    const contracts = await createTestContracts(sites);
    
    return {
      success: true,
      clients,
      sites,
      contracts,
      createTestClients,
      createTestSites,
      createTestContracts
    };
  } catch (error) {
    console.error('Error creating test data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Create test clients
async function createTestClients() {
  const testClients = [
    {
      id: uuidv4(),
      name: 'ACME Corporation',
      contact_name: 'John Doe',
      email: 'john@acme.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      postcode: '90001',
      status: 'active',
      notes: 'Major client with multiple sites'
    },
    {
      id: uuidv4(),
      name: 'Globex Industries',
      contact_name: 'Jane Smith',
      email: 'jane@globex.com',
      phone: '555-987-6543',
      address: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      postcode: '10001',
      status: 'active',
      notes: 'Fast-growing tech company'
    },
    {
      id: uuidv4(),
      name: 'Massive Dynamics',
      contact_name: 'Robert Johnson',
      email: 'robert@massive.com',
      phone: '555-456-7890',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      postcode: '60601',
      status: 'active',
      notes: 'Enterprise client with special requirements'
    }
  ];

  const { data, error } = await supabase
    .from('clients')
    .insert(testClients)
    .select();

  if (error) {
    console.error('Error creating test clients:', error);
    throw error;
  }

  return data || [];
}

// Create test sites using the created clients
async function createTestSites(clients = []) {
  // If no clients were provided, fetch existing clients
  if (!clients.length) {
    const { data: existingClients, error } = await supabase
      .from('clients')
      .select('id')
      .limit(3);
    
    if (error || !existingClients?.length) {
      console.error('No clients available for creating test sites:', error);
      throw new Error('No clients available for creating test sites');
    }
    
    clients = existingClients;
  }
  
  const testSites = [];
  
  // Create sites for each client
  for (const client of clients) {
    testSites.push(
      {
        id: uuidv4(),
        name: `${client.name} Headquarters`,
        address: '100 Main St',
        city: 'San Francisco',
        state: 'CA',
        postcode: '94101',
        client_id: client.id,
        monthly_revenue: 5000,
        status: 'active',
        representative: 'Site Manager 1'
      },
      {
        id: uuidv4(),
        name: `${client.name} Warehouse`,
        address: '200 Industrial Blvd',
        city: 'Oakland',
        state: 'CA',
        postcode: '94607',
        client_id: client.id,
        monthly_revenue: 3500,
        status: 'active',
        representative: 'Site Manager 2'
      }
    );
  }

  const { data, error } = await supabase
    .from('sites')
    .insert(testSites)
    .select();

  if (error) {
    console.error('Error creating test sites:', error);
    throw error;
  }

  return data || [];
}

// Create test contracts for the created sites
async function createTestContracts(sites = []) {
  // If no sites were provided, fetch existing sites
  if (!sites.length) {
    const { data: existingSites, error } = await supabase
      .from('sites')
      .select('id')
      .limit(5);
    
    if (error || !existingSites?.length) {
      console.error('No sites available for creating test contracts:', error);
      throw new Error('No sites available for creating test contracts');
    }
    
    sites = existingSites;
  }
  
  const testContracts = [];
  const today = new Date();
  
  // Create contracts for each site
  for (const site of sites) {
    // Main contract - 1 year
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    testContracts.push({
      id: uuidv4(),
      site_id: site.id,
      contract_type: 'primary',
      value: 5000 * 12, // Annual value
      start_date: today.toISOString().split('T')[0],
      end_date: oneYearFromNow.toISOString().split('T')[0],
      billing_cycle: 'monthly',
      auto_renew: true,
      termination_period: '30 days',
      renewal_terms: 'Automatic renewal for 1 year periods',
      notes: 'Primary cleaning contract'
    });
    
    // Additional contract - 6 months
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    testContracts.push({
      id: uuidv4(),
      site_id: site.id,
      contract_type: 'additional',
      value: 1000 * 6, // 6-month value
      start_date: today.toISOString().split('T')[0],
      end_date: sixMonthsFromNow.toISOString().split('T')[0],
      billing_cycle: 'monthly',
      auto_renew: false,
      termination_period: '15 days',
      renewal_terms: 'Requires manual renewal',
      notes: 'Additional services contract'
    });
  }

  const { data, error } = await supabase
    .from('site_additional_contracts')
    .insert(testContracts)
    .select();

  if (error) {
    console.error('Error creating test contracts:', error);
    throw error;
  }

  return data || [];
}
