
import { useState } from 'react';
import { toast } from 'sonner';
import { setupTestData } from '@/lib/import-export/importOperations';

export function useTestData() {
  const [isCreating, setIsCreating] = useState(false);
  
  const createTestData = async () => {
    try {
      setIsCreating(true);
      
      const testDataGenerator = setupTestData();
      
      // Create test clients
      await testDataGenerator.createTestClients();
      
      // Create test sites
      await testDataGenerator.createTestSites();
      
      // Create test contracts
      await testDataGenerator.createTestContracts();
      
      toast.success('Test data created successfully!');
    } catch (error: any) {
      console.error('Error creating test data:', error);
      toast.error(`Failed to create test data: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  return {
    isCreating,
    createTestData
  };
}
