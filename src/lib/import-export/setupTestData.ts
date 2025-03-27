
import { supabase } from '@/lib/supabase';

export async function setupTestData(): Promise<{ success: boolean; message: string }> {
  try {
    // Get the current user ID for user_id fields
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      return { success: false, message: 'You must be logged in to create test data' };
    }

    // Create test clients
    const testClients = [
      {
        name: 'Acme Corporation',
        contact_name: 'John Doe',
        email: 'john@acme.com',
        phone: '555-1234',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        postcode: '10001',
        status: 'active',
        notes: 'Large corporate client',
        user_id: userId
      },
      {
        name: 'TechStart Inc',
        contact_name: 'Jane Smith',
        email: 'jane@techstart.com',
        phone: '555-5678',
        address: '456 Tech Blvd',
        city: 'San Francisco',
        state: 'CA',
        postcode: '94107',
        status: 'active',
        notes: 'Tech startup client',
        user_id: userId
      },
      {
        name: 'Global Services Ltd',
        contact_name: 'Robert Johnson',
        email: 'robert@globalservices.com',
        phone: '555-9012',
        address: '789 Global Ave',
        city: 'Chicago',
        state: 'IL',
        postcode: '60601',
        status: 'active',
        notes: 'International client',
        user_id: userId
      }
    ];

    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert(testClients)
      .select();

    if (clientsError) {
      console.error('Error creating test clients:', clientsError);
      return { success: false, message: `Failed to create test clients: ${clientsError.message}` };
    }

    // Create test sites using the client IDs
    const testSites = clients.map((client, index) => ({
      name: `${client.name} HQ`,
      client_id: client.id,
      address: `${index + 100} Business Park`,
      city: client.city,
      state: client.state,
      postcode: client.postcode,
      status: 'active',
      monthly_revenue: 5000 + (index * 1000),
      representative: client.contact_name,
      user_id: userId
    }));

    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .insert(testSites)
      .select();

    if (sitesError) {
      console.error('Error creating test sites:', sitesError);
      return { success: false, message: `Failed to create test sites: ${sitesError.message}` };
    }

    // Create test contractors
    const testContractors = [
      {
        business_name: 'ABC Cleaning',
        contact_name: 'Alan Brown',
        email: 'alan@abccleaning.com',
        phone: '555-2468',
        address: '321 Clean St',
        city: 'Boston',
        state: 'MA',
        postcode: '02108',
        contractor_type: 'cleaning',
        status: 'active',
        hourly_rate: 35,
        day_rate: 280,
        user_id: userId
      },
      {
        business_name: 'XYZ Maintenance',
        contact_name: 'Sarah Wilson',
        email: 'sarah@xyzmaintenance.com',
        phone: '555-1357',
        address: '654 Fix Ave',
        city: 'Denver',
        state: 'CO',
        postcode: '80202',
        contractor_type: 'maintenance',
        status: 'active',
        hourly_rate: 45,
        day_rate: 350,
        user_id: userId
      }
    ];

    const { error: contractorsError } = await supabase
      .from('contractors')
      .insert(testContractors);

    if (contractorsError) {
      console.error('Error creating test contractors:', contractorsError);
      return { success: false, message: `Failed to create test contractors: ${contractorsError.message}` };
    }

    return { 
      success: true, 
      message: `Successfully created ${testClients.length} clients, ${testSites.length} sites, and ${testContractors.length} contractors.` 
    };
  } catch (error: any) {
    console.error('Error setting up test data:', error);
    return { success: false, message: `Failed to set up test data: ${error.message}` };
  }
}
