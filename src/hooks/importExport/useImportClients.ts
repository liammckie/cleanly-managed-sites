
import { toast } from 'sonner';
import { ClientRecord } from '@/lib/types';
import { parseCSV, importClients, convertCSVToClientFormat } from '@/lib/import-export';

export function useImportClients() {
  const handleImportClients = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    try {
      if (fileType === 'csv') {
        data = convertCSVToClientFormat(data);
      }
      
      await importClients(data);
      toast.success(`${data.length} clients imported successfully`);
    } catch (error: any) {
      toast.error(`Failed to import clients: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImportClients = async (file: File) => {
    try {
      const parsedData = await parseCSV(file);
      await handleImportClients(parsedData, 'csv');
    } catch (error: any) {
      console.error(`Error importing clients from CSV:`, error);
      toast.error(`Failed to import clients: ${error.message}`);
      throw error;
    }
  };

  return {
    handleImportClients,
    handleCSVImportClients,
  };
}
