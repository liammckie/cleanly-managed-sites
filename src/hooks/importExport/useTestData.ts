
import { useState } from 'react';
import { setupTestData } from '@/lib/import-export/setupTestData';
import { toast } from 'sonner';

export function useTestData() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const generateTestData = async () => {
    setIsGenerating(true);
    try {
      await setupTestData();
      setIsGenerated(true);
      toast.success('Test data generated successfully');
    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error('Error generating test data');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    isGenerated,
    generateTestData
  };
}
