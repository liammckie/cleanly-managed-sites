
import { useState } from 'react';
import { toast } from 'sonner';
import { parseCSV, importContractors } from '@/lib/import-export';
import { convertCSVToContractorFormat } from '@/lib/import-export/fileFormatConversion';

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
      toast.error(`Failed to import contractors from CSV: ${error.message}`);
      setImportResults({
        success: false,
        error: error.message
      });
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
