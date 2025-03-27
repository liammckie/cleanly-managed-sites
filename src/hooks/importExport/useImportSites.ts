
import { useState } from 'react';
import { importSites as importSitesApi } from '@/lib/import-export';
import { parseCSV } from '@/lib/import-export';

export function useImportSites() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // Handle import from raw data
  const handleImportSites = async (data: any[]) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const results = await importSitesApi(data);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing sites:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  // Handle import from CSV file
  const handleCSVImportSites = async (file: File) => {
    try {
      setIsImporting(true);
      setImportResults(null);
      
      const parsedData = await parseCSV(file);
      if (!parsedData || !Array.isArray(parsedData)) {
        throw new Error('Invalid CSV data format');
      }
      
      const results = await importSitesApi(parsedData);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('Error importing sites from CSV:', error);
      setImportResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    handleImportSites,
    handleCSVImportSites,
    // For backward compatibility
    importSites: handleImportSites,
    result: importResults
  };
}
