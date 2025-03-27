
import { useState } from 'react';
import { toast } from 'sonner';
import { setupTestData } from '@/lib/import-export/importOperations';

export function useTestData() {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const testDataOperations = setupTestData();
  
  const createTestClients = async () => {
    try {
      setIsCreating(true);
      const data = await testDataOperations.createTestClients();
      setResults({
        success: true,
        count: data.length,
        message: `${data.length} test clients created`
      });
      return data;
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message
      });
      toast.error(`Failed to create test clients: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const createTestSites = async () => {
    try {
      setIsCreating(true);
      const data = await testDataOperations.createTestSites();
      setResults({
        success: true,
        count: data.length,
        message: `${data.length} test sites created`
      });
      return data;
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message
      });
      toast.error(`Failed to create test sites: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const createTestContracts = async () => {
    try {
      setIsCreating(true);
      const data = await testDataOperations.createTestContracts();
      setResults({
        success: true,
        count: data.length,
        message: `${data.length} test contracts created`
      });
      return data;
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message
      });
      toast.error(`Failed to create test contracts: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const createAllTestData = async () => {
    try {
      setIsCreating(true);
      await createTestClients();
      await createTestSites();
      await createTestContracts();
      toast.success("All test data created successfully");
      setResults({
        success: true,
        message: "All test data created successfully"
      });
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message
      });
      toast.error(`Failed to create all test data: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  return {
    isCreating,
    results,
    createTestClients,
    createTestSites,
    createTestContracts,
    createAllTestData
  };
}
