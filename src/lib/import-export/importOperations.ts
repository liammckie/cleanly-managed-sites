
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const setupTestData = () => {
  const createTestClients = async () => {
    try {
      const testClients = [
        {
          name: 'Test Client 1',
          contact_name: 'John Doe',
          email: 'john@example.com',
          phone: '0400123456',
          address: '123 Test Street',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia',
          status: 'active'
        },
        {
          name: 'Test Client 2',
          contact_name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0400654321',
          address: '456 Test Avenue',
          city: 'Melbourne',
          state: 'VIC',
          postcode: '3000',
          country: 'Australia',
          status: 'active'
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

      console.log('Created test clients:', data);
      toast.success('Test clients created successfully');
      return data;
    } catch (error) {
      console.error('Error in createTestClients:', error);
      toast.error('Failed to create test clients');
      return [];
    }
  };

  const createTestSites = async () => {
    try {
      // First, get the client IDs
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .limit(2);

      if (clientError) {
        console.error('Error fetching clients:', clientError);
        throw clientError;
      }

      if (!clients || clients.length === 0) {
        console.error('No clients found. Creating test clients first...');
        const newClients = await createTestClients();
        if (!newClients || newClients.length === 0) {
          throw new Error('Failed to create test clients');
        }
      }

      const clientIds = clients.map(client => client.id);

      const testSites = [
        {
          name: 'Test Site 1',
          address: '123 Test Street',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia',
          client_id: clientIds[0],
          status: 'active',
          email: 'site1@example.com',
          phone: '0400111222'
        },
        {
          name: 'Test Site 2',
          address: '456 Test Avenue',
          city: 'Melbourne',
          state: 'VIC',
          postcode: '3000',
          country: 'Australia',
          client_id: clientIds[1],
          status: 'active',
          email: 'site2@example.com',
          phone: '0400333444'
        }
      ];

      const { data, error } = await supabase
        .from('sites')
        .insert(testSites)
        .select();

      if (error) {
        console.error('Error creating test sites:', error);
        throw error;
      }

      console.log('Created test sites:', data);
      toast.success('Test sites created successfully');
      return data;
    } catch (error) {
      console.error('Error in createTestSites:', error);
      toast.error('Failed to create test sites');
      return [];
    }
  };

  const createTestContracts = async () => {
    try {
      // First, get the site IDs
      const { data: sites, error: siteError } = await supabase
        .from('sites')
        .select('id')
        .limit(2);

      if (siteError) {
        console.error('Error fetching sites:', siteError);
        throw siteError;
      }

      if (!sites || sites.length === 0) {
        console.error('No sites found. Creating test sites first...');
        const newSites = await createTestSites();
        if (!newSites || newSites.length === 0) {
          throw new Error('Failed to create test sites');
        }
      }

      const siteIds = sites.map(site => site.id);

      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const testContracts = [
        {
          site_id: siteIds[0],
          contract_number: 'CONT-001',
          contract_type: 'cleaning',
          start_date: today.toISOString().split('T')[0],
          end_date: oneYearLater.toISOString().split('T')[0],
          value: 12000,
          billing_cycle: 'monthly',
          auto_renew: true
        },
        {
          site_id: siteIds[1],
          contract_number: 'CONT-002',
          contract_type: 'maintenance',
          start_date: today.toISOString().split('T')[0],
          end_date: oneYearLater.toISOString().split('T')[0],
          value: 24000,
          billing_cycle: 'monthly',
          auto_renew: false
        }
      ];

      const { data, error } = await supabase
        .from('site_additional_contracts')
        .insert(testContracts)
        .select();

      if (error) {
        console.error('Error creating test contracts:', error);
        throw error;
      }

      console.log('Created test contracts:', data);
      toast.success('Test contracts created successfully');
      return data;
    } catch (error) {
      console.error('Error in createTestContracts:', error);
      toast.error('Failed to create test contracts');
      return [];
    }
  };

  return {
    createTestClients,
    createTestSites,
    createTestContracts
  };
};
