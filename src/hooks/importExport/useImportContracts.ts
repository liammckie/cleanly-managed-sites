
import { toast } from 'sonner';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { parseCSV, importContracts, convertCSVToContractFormat } from '@/lib/import-export';

export function useImportContracts() {
  const handleImportContracts = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    try {
      if (fileType === 'csv') {
        data = convertCSVToContractFormat(data);
      }
      
      await importContracts(data);
      toast.success(`${data.length} contracts imported successfully`);
    } catch (error: any) {
      toast.error(`Failed to import contracts: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImportContracts = async (file: File) => {
    try {
      const parsedData = await parseCSV(file);
      await handleImportContracts(parsedData, 'csv');
    } catch (error: any) {
      console.error(`Error importing contracts from CSV:`, error);
      toast.error(`Failed to import contracts: ${error.message}`);
      throw error;
    }
  };

  return {
    handleImportContracts,
    handleCSVImportContracts,
  };
}
