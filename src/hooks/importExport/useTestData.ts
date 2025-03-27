
import { toast } from 'sonner';
import { useState } from 'react';
import { setupTestData } from '@/lib/import-export';

export function useTestData() {
  const [isCreating, setIsCreating] = useState(false);
  const [creationResult, setCreationResult] = useState<any>(null);

  const createTestData = async (): Promise<void> => {
    try {
      setIsCreating(true);
      const result = await setupTestData();
      
      if (result.success) {
        toast.success('Test data created successfully');
        setCreationResult({
          success: true,
          message: 'Test data created successfully',
          clients: result.clients,
          sites: result.sites
        });
      } else {
        toast.error(`Failed to create test data: ${result.error}`);
        setCreationResult({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      toast.error(`Failed to create test data: ${error.message}`);
      setCreationResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsCreating(false);
    }
  };

  const createTestClients = async (): Promise<void> => {
    try {
      setIsCreating(true);
      const result = await setupTestData();
      
      if (result.createTestClients) {
        const clients = await result.createTestClients();
        toast.success(`${clients.length} test clients created successfully`);
      } else {
        toast.error('Failed to create test clients');
      }
    } catch (error: any) {
      toast.error(`Failed to create test clients: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const createTestSites = async (): Promise<void> => {
    try {
      setIsCreating(true);
      const result = await setupTestData();
      
      if (result.createTestSites) {
        const sites = await result.createTestSites();
        toast.success(`${sites.length} test sites created successfully`);
      } else {
        toast.error('Failed to create test sites');
      }
    } catch (error: any) {
      toast.error(`Failed to create test sites: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const createTestContracts = async (): Promise<void> => {
    try {
      setIsCreating(true);
      const result = await setupTestData();
      
      if (result.createTestContracts) {
        const contracts = await result.createTestContracts();
        toast.success(`${contracts.length} test contracts created successfully`);
      } else {
        toast.error('Failed to create test contracts');
      }
    } catch (error: any) {
      toast.error(`Failed to create test contracts: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    creationResult,
    createTestData,
    createTestClients,
    createTestSites,
    createTestContracts
  };
}
