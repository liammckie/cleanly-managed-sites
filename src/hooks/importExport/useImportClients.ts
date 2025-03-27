
import { toast } from 'sonner';
import { ClientRecord } from '@/lib/types';
import { 
  parseCSV, 
  convertCSVToClientFormat, 
  importClients 
} from '@/lib/import-export/parseImportedFile';

export function useImportClients() {
  const handleImportClients = async (data: any[]): Promise<void> => {
    try {
      await importClients(data);
      toast.success(`${data.length} clients imported successfully`);
    } catch (error: any) {
      toast.error(`Failed to import clients: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImportClients = async (file: File): Promise<void> => {
    try {
      const csvData = await parseCSV(file);
      const clients = convertCSVToClientFormat(csvData);
      await handleImportClients(clients);
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
