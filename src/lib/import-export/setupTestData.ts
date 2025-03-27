
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function setupTestData(): Promise<{ success: boolean; message: string }> {
  try {
    // Create a test client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: 'Test Company Inc.',
        contact_name: 'John Doe',
        email: 'john@testcompany.com',
        phone: '555-123-4567',
        address: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postcode: '12345',
        status: 'active',
        notes: 'This is a test client created for demonstration purposes.'
      })
      .select()
      .single();

    if (clientError) {
      throw clientError;
    }

    // Create test sites for the client
    const testSites = [
      {
        name: 'Main Office',
        client_id: client.id,
        address: '123 Main Street',
        city: 'Test City',
        state: 'TS',
        postcode: '12345',
        status: 'active',
        monthly_revenue: 5000,
        representative: 'Jane Smith'
      },
      {
        name: 'Warehouse',
        client_id: client.id,
        address: '456 Storage Ave',
        city: 'Test City',
        state: 'TS',
        postcode: '12345',
        status: 'active',
        monthly_revenue: 3500,
        representative: 'Bob Johnson'
      }
    ];

    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .insert(testSites)
      .select();

    if (sitesError) {
      throw sitesError;
    }

    // Create test contractors
    const testContractors = [
      {
        business_name: 'Clean Team Services',
        contact_name: 'Mike Wilson',
        email: 'mike@cleanteam.com',
        phone: '555-987-6543',
        address: '789 Cleaner St',
        city: 'Test City',
        state: 'TS',
        postcode: '12345',
        contractor_type: 'cleaning',
        status: 'active',
        hourly_rate: 35,
        day_rate: 280
      },
      {
        business_name: 'Security Pros',
        contact_name: 'Sarah Adams',
        email: 'sarah@securitypros.com',
        phone: '555-456-7890',
        address: '321 Security Blvd',
        city: 'Test City',
        state: 'TS',
        postcode: '12345',
        contractor_type: 'security',
        status: 'active',
        hourly_rate: 40,
        day_rate: 320
      }
    ];

    const { data: contractors, error: contractorsError } = await supabase
      .from('contractors')
      .insert(testContractors)
      .select();

    if (contractorsError) {
      throw contractorsError;
    }

    // Create test contracts
    if (sites && sites.length > 0) {
      const testContracts = sites.map(site => ({
        site_id: site.id,
        contract_type: 'service',
        value: site.monthly_revenue * 12,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        billing_cycle: 'monthly',
        auto_renew: true,
        termination_period: '60 days',
        renewal_terms: 'Automatic renewal for 12 months',
        notes: `Test contract for ${site.name}`
      }));

      const { error: contractsError } = await supabase
        .from('site_additional_contracts')
        .insert(testContracts);

      if (contractsError) {
        throw contractsError;
      }
    }

    return { 
      success: true, 
      message: 'Test data created successfully! Added 1 client, 2 sites, 2 contractors, and associated contracts.' 
    };
  } catch (error: any) {
    console.error('Error creating test data:', error);
    return { 
      success: false, 
      message: `Failed to create test data: ${error.message}` 
    };
  }
}

export async function createTestData(): Promise<void> {
  try {
    const result = await setupTestData();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  } catch (error: any) {
    console.error('Error creating test data:', error);
    toast.error(`Failed to create test data: ${error.message}`);
  }
}
