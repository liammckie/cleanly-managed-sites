
import { toast } from 'sonner';
import { SiteRecord } from '@/lib/types';
import { 
  parseCSV, 
  convertCSVToSiteFormat, 
  importSites 
} from '@/lib/import-export/parseImportedFile';

export function useImportSites() {
  const handleImportSites = async (data: any[]): Promise<void> => {
    try {
      await importSites(data);
      toast.success(`${data.length} sites imported successfully`);
    } catch (error: any) {
      toast.error(`Failed to import sites: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImportSites = async (file: File): Promise<void> => {
    try {
      const csvData = await parseCSV(file);
      const sites = convertCSVToSiteFormat(csvData);
      await handleImportSites(sites);
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
