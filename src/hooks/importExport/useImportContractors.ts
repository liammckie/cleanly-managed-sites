
import { toast } from 'sonner';
import { useState } from 'react';
import { 
  parseCSV, 
  convertCSVToContractorFormat, 
  importContractors 
} from '@/lib/import-export/importOperations';

export function useImportContractors() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportContractors = async (data: any[]): Promise<void> => {
    try {
      setIsImporting(true);
      await importContractors(data);
      toast.success(`${data.length} contractors imported successfully`);
      setImportResults({
        success: true,
        count: data.length,
        message: `${data.length} contractors imported successfully`
      });
    } catch (error: any) {
      toast.error(`Failed to import contractors: ${error.message}`);
      setImportResults({
        success: false,
        error: error.message
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const handleCSVImportContractors = async (file: File): Promise<void> => {
    try {
      setIsImporting(true);
      const csvData = await parseCSV(file);
      const contractors = convertCSVToContractorFormat(csvData);
      await handleImportContractors(contractors);
    } catch (error: any) {
      console.error(`Error importing contractors from CSV:`, error);
      toast.error(`Failed to import contractors: ${error.message}`);
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
    handleImportContractors,
    handleCSVImportContractors,
  };
}
