
import { useState } from 'react';
import { setupTestData } from '@/lib/import-export';

export function useTestData() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, any> | null>(null);

  const generateTestData = async (options?: { 
    clients?: number; 
    sites?: number; 
    contractors?: number;
    includeWorkOrders?: boolean;
  }) => {
    try {
      setIsGenerating(true);
      setResults(null);
      
      const defaultOptions = {
        clients: 5,
        sites: 10,
        contractors: 5,
        includeWorkOrders: true,
        ...options
      };
      
      const data = await setupTestData(defaultOptions);
      setResults(data);
      return data;
    } catch (error) {
      console.error('Error generating test data:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateTestData,
    isGenerating,
    results
  };
}
