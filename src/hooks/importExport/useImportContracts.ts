
import { useState } from 'react';
import { toast } from 'sonner';
import { parseCSV, convertCSVToContractFormat, importContractors } from '@/lib/import-export';
import { ImportOptions } from '@/lib/import-export/types';

export function useImportContracts() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  
  const handleImportCSV = async (file: File) => {
    try {
      setIsImporting(true);
      
      // Parse the CSV file into a JSON array
      const parsedData = await parseCSV(file);
      
      if (!parsedData || parsedData.length === 0) {
        toast.error('No valid data found in CSV file');
        return;
      }
      
      // Convert the parsed data to the contract format
      const contractData = convertCSVToContractFormat(parsedData);
      
      // Import the contracts with options
      const importOptions: ImportOptions = {
        mode: 'incremental',
        format: 'csv',
        type: 'contractors'
      };
      
      const results = await importContractors(contractData, importOptions);
      
      setImportResults(results);
      
      // Show a success message
      const importedCount = results && typeof results === 'object' ? results.imported || 0 : 0;
      toast.success(`Successfully imported ${importedCount} contracts`);
      
    } catch (error) {
      console.error('Error importing contracts:', error);
      toast.error('Failed to import contracts');
    } finally {
      setIsImporting(false);
    }
  };
  
  return {
    isImporting,
    importResults,
    handleImportCSV
  };
}
