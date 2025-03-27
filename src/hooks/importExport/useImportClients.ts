
import { toast } from 'sonner';
import { useState } from 'react';
import { 
  parseCSV, 
  convertCSVToClientFormat, 
  importClients 
} from '@/lib/import-export/importOperations';

export function useImportClients() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportClients = async (data: any[]): Promise<void> => {
    try {
      setIsImporting(true);
      await importClients(data);
      toast.success(`${data.length} clients imported successfully`);
      setImportResults({
        success: true,
        count: data.length,
        message: `${data.length} clients imported successfully`
      });
    } catch (error: any) {
      toast.error(`Failed to import clients: ${error.message}`);
      setImportResults({
        success: false,
        error: error.message
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const handleCSVImportClients = async (file: File): Promise<void> => {
    try {
      setIsImporting(true);
      const csvData = await parseCSV(file);
      const clients = convertCSVToClientFormat(csvData);
      await handleImportClients(clients);
    } catch (error: any) {
      console.error(`Error importing clients from CSV:`, error);
      toast.error(`Failed to import clients: ${error.message}`);
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
    handleImportClients,
    handleCSVImportClients,
  };
}
