
import { toast } from 'sonner';
import { useState } from 'react';
import { 
  parseCSV, 
  convertCSVToContractFormat, 
  importContracts 
} from '@/lib/import-export/importOperations';

export function useImportContracts() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportContracts = async (data: any[]): Promise<void> => {
    try {
      setIsImporting(true);
      await importContracts(data);
      toast.success(`${data.length} contracts imported successfully`);
      setImportResults({
        success: true,
        count: data.length,
        message: `${data.length} contracts imported successfully`
      });
    } catch (error: any) {
      toast.error(`Failed to import contracts: ${error.message}`);
      setImportResults({
        success: false,
        error: error.message
      });
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
      console.error(`Error importing contracts from CSV:`, error);
      toast.error(`Failed to import contracts: ${error.message}`);
      setImportResults({
        success: false,
        error: error.message
      });
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
  };
}
