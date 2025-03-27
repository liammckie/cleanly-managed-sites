
import { useState } from 'react';
import { importContractors as importContractorsApi } from '@/lib/import-export';
import { parseCSV } from '@/lib/import-export';

export function useImportContractors() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // Handle import from raw data
  const handleImportContractors = async (data: any[]) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const results = await importContractorsApi(data);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing contractors:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  // Handle import from CSV file
  const handleCSVImportContractors = async (file: File) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const parsedData = await parseCSV(file);
      if (!parsedData || !Array.isArray(parsedData)) {
        throw new Error('Invalid CSV data format');
      }
      
      const results = await importContractorsApi(parsedData);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing contractors from CSV:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    handleImportContractors,
    handleCSVImportContractors,
    // For backward compatibility
    importContractors: handleImportContractors,
    result: importResults
  };
}
