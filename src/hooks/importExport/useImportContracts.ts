
import { useState } from 'react';
import { importContracts as importContractsApi } from '@/lib/import-export';
import { parseCSV } from '@/lib/import-export';

export function useImportContracts() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // Handle import from raw data
  const handleImportContracts = async (data: any[]) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const results = await importContractsApi(data);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing contracts:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  // Handle import from CSV file
  const handleCSVImportContracts = async (file: File) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const parsedData = await parseCSV(file);
      if (!parsedData || !Array.isArray(parsedData)) {
        throw new Error('Invalid CSV data format');
      }
      
      const results = await importContractsApi(parsedData);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing contracts from CSV:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    handleImportContracts,
    handleCSVImportContracts,
    // For backward compatibility
    importContracts: handleImportContracts,
    result: importResults
  };
}
