
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function setupTestData(): Promise<boolean> {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create test data');
    }

    const userId = user.id;
    
    // Create test clients
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .insert([
        {
          name: 'Acme Corporation',
          contact_name: 'John Doe',
          email: 'john@acme.com',
          phone: '555-123-4567',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postcode: '12345',
          status: 'active',
          notes: 'This is a test client',
          user_id: userId
        },
        {
          name: 'Globex Corporation',
          contact_name: 'Jane Smith',
          email: 'jane@globex.com',
          phone: '555-987-6543',
          address: '456 Elm St',
          city: 'Springfield',
          state: 'IL',
          postcode: '67890',
          status: 'active',
          notes: 'Another test client',
          user_id: userId
        }
      ])
      .select();
    
    if (clientsError) {
      console.error('Error creating test clients:', clientsError);
      throw clientsError;
    }
    
    // Create test sites for each client
    const sitesData = [];
    for (const client of clientsData || []) {
      sitesData.push(
        {
          name: `${client.name} Headquarters`,
          client_id: client.id,
          address: '789 Oak St',
          city: 'Los Angeles',
          state: 'CA',
          postcode: '90001',
          status: 'active',
          monthly_revenue: 5000,
          representative: 'Test Rep',
          user_id: userId
        },
        {
          name: `${client.name} Branch Office`,
          client_id: client.id,
          address: '101 Pine St',
          city: 'San Francisco',
          state: 'CA',
          postcode: '94101',
          status: 'active',
          monthly_revenue: 3000,
          representative: 'Test Rep',
          user_id: userId
        }
      );
    }
    
    const { error: sitesError } = await supabase
      .from('sites')
      .insert(sitesData);
    
    if (sitesError) {
      console.error('Error creating test sites:', sitesError);
      throw sitesError;
    }
    
    // Create test contractors
    const { error: contractorsError } = await supabase
      .from('contractors')
      .insert([
        {
          business_name: 'ABC Contractors',
          contact_name: 'Bob Builder',
          email: 'bob@abccontractors.com',
          phone: '555-111-2222',
          address: '222 Contractor Ave',
          city: 'Builder City',
          state: 'TX',
          postcode: '75001',
          contractor_type: 'general',
          status: 'active',
          hourly_rate: 85,
          day_rate: 600,
          user_id: userId
        },
        {
          business_name: 'XYZ Maintenance',
          contact_name: 'Mike Fixer',
          email: 'mike@xyzmaintenance.com',
          phone: '555-333-4444',
          address: '333 Maintenance Blvd',
          city: 'Fixington',
          state: 'FL',
          postcode: '33101',
          contractor_type: 'specialized',
          status: 'active',
          hourly_rate: 95,
          day_rate: 700,
          user_id: userId
        }
      ]);
    
    if (contractorsError) {
      console.error('Error creating test contractors:', contractorsError);
      throw contractorsError;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up test data:', error);
    return false;
  }
}
