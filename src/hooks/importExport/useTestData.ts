
import { useState } from 'react';
import { setupTestData } from '@/lib/import-export';
import { toast } from 'sonner';

export function useTestData() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createTestData = async () => {
    setIsCreating(true);
    try {
      const result = await setupTestData();
      setResult(result);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Error creating test data:', error);
      setResult({ 
        success: false, 
        message: `Failed to create test data: ${error.message}` 
      });
      toast.error(`Failed to create test data: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTestData,
    isCreating,
    result
  };
}
