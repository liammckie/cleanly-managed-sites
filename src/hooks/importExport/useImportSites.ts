
import { toast } from 'sonner';
import { SiteRecord } from '@/lib/types';
import { 
  parseCSV, 
  importSites, 
  convertCSVToSiteFormat 
} from '@/lib/import-export/parseImportedFile';

export function useImportSites() {
  const handleImportSites = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    try {
      if (fileType === 'csv') {
        data = convertCSVToSiteFormat(data);
      }
      
      await importSites(data);
      toast.success(`${data.length} sites imported successfully`);
    } catch (error: any) {
      toast.error(`Failed to import sites: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImportSites = async (file: File) => {
    try {
      const parsedData = await parseCSV(file);
      await handleImportSites(parsedData, 'csv');
    } catch (error: any) {
      console.error(`Error importing sites from CSV:`, error);
      toast.error(`Failed to import sites: ${error.message}`);
      throw error;
    }
  };

  return {
    handleImportSites,
    handleCSVImportSites,
  };
}
