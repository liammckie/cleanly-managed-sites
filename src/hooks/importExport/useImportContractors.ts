
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  parseCSV, 
  convertCSVToContractorFormat, 
  importContractors 
} from '@/lib/import-export/parseImportedFile';

export function useImportContractors() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportContractors = async (data: any[]): Promise<void> => {
    try {
      setIsImporting(true);
      const result = await importContractors(data);
      setImportResults(result);
      toast.success('Contractors imported successfully');
    } catch (error: any) {
      toast.error(`Failed to import contractors: ${error.message}`);
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
      toast.error(`Failed to import contractors from CSV: ${error.message}`);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    handleImportContractors,
    handleCSVImportContractors
  };
}
