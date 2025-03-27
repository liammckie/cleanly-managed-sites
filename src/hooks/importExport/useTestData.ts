
import { useState } from 'react';
import { setupTestData } from '@/lib/import-export';
import { toast } from 'sonner';

export function useTestData() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>({
    success: false,
    message: ''
  });

  const generateTestData = async () => {
    setIsGenerating(true);
    try {
      const success = await setupTestData();
      setResult({ 
        success, 
        message: success ? 'Test data created successfully' : 'Failed to create test data' 
      });
      
      if (success) {
        toast.success('Test data generated successfully');
      } else {
        toast.error('Failed to generate test data');
      }
    } catch (error) {
      console.error('Error generating test data:', error);
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      toast.error(`Error generating test data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Alias generateTestData as createTestData for compatibility
  const createTestData = generateTestData;
  
  return {
    isGenerating,
    result,
    generateTestData,
    createTestData,
    isCreating: isGenerating
  };
}
