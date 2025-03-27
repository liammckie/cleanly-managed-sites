
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Set up test data for the application
 */
export async function setupTestData() {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to generate test data');
    }

    // Create test clients
    const testClients = await createTestClients(user.id);
    
    // Create test sites based on those clients
    await createTestSites(testClients, user.id);
    
    // Create test contractors
    await createTestContractors(user.id);
    
    return { success: true, message: 'Test data created successfully' };
  } catch (error) {
    console.error('Error creating test data:', error);
    return { success: false, error: (error as Error).message };
  }
}

async function createTestClients(userId: string) {
  const clients = [
    {
      name: 'ABC Corporation',
      contact_name: 'John Smith',
      email: 'jsmith@abccorp.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postcode: '10001',
      status: 'active',
      notes: 'Major client with multiple sites',
      user_id: userId
    },
    {
      name: 'Tech Innovations',
      contact_name: 'Sarah Jones',
      email: 'sarah@techinnovations.com',
      phone: '555-987-6543',
      address: '456 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      postcode: '94107',
      status: 'active',
      notes: 'New client, started last month',
      user_id: userId
    },
    {
      name: 'Global Services Inc.',
      contact_name: 'Michael Brown',
      email: 'mbrown@globalservices.com',
      phone: '555-456-7890',
      address: '789 Global Ave',
      city: 'Chicago',
      state: 'IL',
      postcode: '60606',
      status: 'active',
      notes: 'International client with multiple locations',
      user_id: userId
    }
  ];
  
  const { data, error } = await supabase
    .from('clients')
    .insert(clients)
    .select();
    
  if (error) throw error;
  return data;
}

async function createTestSites(clients: any[], userId: string) {
  const sites = clients.flatMap(client => [
    {
      name: `${client.name} - Headquarters`,
      client_id: client.id,
      address: `${Math.floor(Math.random() * 1000)} Corporate Drive`,
      city: client.city,
      state: client.state,
      postcode: client.postcode,
      status: 'active',
      monthly_revenue: Math.floor(Math.random() * 10000) + 5000,
      representative: 'Main Office',
      user_id: userId
    },
    {
      name: `${client.name} - Branch Office`,
      client_id: client.id,
      address: `${Math.floor(Math.random() * 1000)} Branch Street`,
      city: client.city,
      state: client.state,
      postcode: client.postcode,
      status: 'active',
      monthly_revenue: Math.floor(Math.random() * 5000) + 2000,
      representative: 'Branch Location',
      user_id: userId
    }
  ]);
  
  const { error } = await supabase
    .from('sites')
    .insert(sites);
    
  if (error) throw error;
}

async function createTestContractors(userId: string) {
  const contractors = [
    {
      business_name: 'Alpha Cleaning Services',
      contact_name: 'Robert Johnson',
      email: 'robert@alphaclean.com',
      phone: '555-111-2222',
      address: '100 Service Road',
      city: 'Dallas',
      state: 'TX',
      postcode: '75201',
      contractor_type: 'cleaning',
      status: 'active',
      hourly_rate: 45,
      day_rate: 350,
      user_id: userId
    },
    {
      business_name: 'Beta Maintenance Co.',
      contact_name: 'Lisa Miller',
      email: 'lisa@betamaint.com',
      phone: '555-333-4444',
      address: '200 Fix-It Lane',
      city: 'Atlanta',
      state: 'GA',
      postcode: '30303',
      contractor_type: 'maintenance',
      status: 'active',
      hourly_rate: 60,
      day_rate: 450,
      user_id: userId
    },
    {
      business_name: 'Gamma Security Systems',
      contact_name: 'David Wilson',
      email: 'david@gammasecurity.com',
      phone: '555-555-6666',
      address: '300 Security Blvd',
      city: 'Miami',
      state: 'FL',
      postcode: '33101',
      contractor_type: 'security',
      status: 'active',
      hourly_rate: 55,
      day_rate: 400,
      user_id: userId
    }
  ];
  
  const { error } = await supabase
    .from('contractors')
    .insert(contractors);
    
  if (error) throw error;
}
