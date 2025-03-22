
import { toast } from 'sonner';
import { setupTestData as setupTestDataFn } from '@/lib/import-export';

export function useTestData() {
  const setupTestData = async (): Promise<void> => {
    try {
      await setupTestDataFn();
      toast.success('Test data created successfully!');
    } catch (error: any) {
      toast.error(`Failed to create test data: ${error.message}`);
      throw error;
    }
  };

  return {
    setupTestData
  };
}
