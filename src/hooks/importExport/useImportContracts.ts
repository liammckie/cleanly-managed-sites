
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  parseCSV, 
  convertCSVToContractFormat, 
  importContracts 
} from '@/lib/import-export/parseImportedFile';

export function useImportContracts() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportContracts = async (data: any[]): Promise<void> => {
    try {
      setIsImporting(true);
      const result = await importContracts(data);
      setImportResults(result);
      toast.success('Contracts imported successfully');
    } catch (error: any) {
      toast.error(`Failed to import contracts: ${error.message}`);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const handleCSVImportContracts = async (file: File): Promise<void> => {
    try {
      setIsImporting(true);
      const csvData = await parseCSV(file);
      const contracts = convertCSVToContractFormat(csvData);
      await handleImportContracts(contracts);
    } catch (error: any) {
      toast.error(`Failed to import contracts from CSV: ${error.message}`);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    handleImportContracts,
    handleCSVImportContracts
  };
}
