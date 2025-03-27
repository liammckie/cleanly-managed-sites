
import { toast } from 'sonner';
import { useState } from 'react';
import { 
  parseCSV, 
  convertCSVToSiteFormat, 
  importSites 
} from '@/lib/import-export/importOperations';

export function useImportSites() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleImportSites = async (data: any[]): Promise<void> => {
    try {
      setIsImporting(true);
      await importSites(data);
      toast.success(`${data.length} sites imported successfully`);
      setImportResults({
        success: true,
        count: data.length,
        message: `${data.length} sites imported successfully`
      });
    } catch (error: any) {
      toast.error(`Failed to import sites: ${error.message}`);
      setImportResults({
        success: false,
        error: error.message
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const handleCSVImportSites = async (file: File): Promise<void> => {
    try {
      setIsImporting(true);
      const csvData = await parseCSV(file);
      const sites = convertCSVToSiteFormat(csvData);
      await handleImportSites(sites);
    } catch (error: any) {
      console.error(`Error importing sites from CSV:`, error);
      toast.error(`Failed to import sites: ${error.message}`);
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
    handleImportSites,
    handleCSVImportSites,
  };
}
