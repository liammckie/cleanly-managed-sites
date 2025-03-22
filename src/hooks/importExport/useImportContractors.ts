
import { toast } from 'sonner';
import { parseCSV, convertCSVToContractorFormat, importContractors as importContractorsFn } from '@/lib/import-export';

export function useImportContractors() {
  const handleImportContractors = async (data: any[]): Promise<void> => {
    try {
      await importContractorsFn(data);
      toast.success('Contractors imported successfully');
    } catch (error: any) {
      toast.error(`Failed to import contractors: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImportContractors = async (file: File): Promise<void> => {
    try {
      const csvData = await parseCSV(file);
      const contractors = convertCSVToContractorFormat(csvData);
      await handleImportContractors(contractors);
    } catch (error: any) {
      toast.error(`Failed to import contractors from CSV: ${error.message}`);
      throw error;
    }
  };

  return {
    handleImportContractors,
    handleCSVImportContractors
  };
}
