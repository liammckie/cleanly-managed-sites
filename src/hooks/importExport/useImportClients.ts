
import { useState } from 'react';
import { importClients as importClientsApi } from '@/lib/import-export';
import { parseCSV } from '@/lib/import-export';

export function useImportClients() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // Handle import from raw data
  const handleImportClients = async (data: any[]) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const results = await importClientsApi(data);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing clients:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  // Handle import from CSV file
  const handleCSVImportClients = async (file: File) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const parsedData = await parseCSV(file);
      if (!parsedData || !Array.isArray(parsedData)) {
        throw new Error('Invalid CSV data format');
      }
      
      const results = await importClientsApi(parsedData);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing clients from CSV:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    handleImportClients,
    handleCSVImportClients,
    // For backward compatibility
    importClients: handleImportClients,
    result: importResults
  };
}
