
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { getClientCSVTemplate, getSiteCSVTemplate, getContractCSVTemplate } from '@/lib/importValidation';
import {
  parseCSV,
  importClients,
  importSites,
  importContracts,
  convertCSVToClientFormat,
  convertCSVToSiteFormat, 
  convertCSVToContractFormat,
  setupTestData as setupTestDataFn,
  handleUnifiedImport as handleUnifiedImportFn
} from '@/lib/import-export';

export function useDataImportExport() {
  const { data: contractHistory, isLoading: isLoadingContracts } = useQuery({
    queryKey: ['all-contracts-history'],
    queryFn: async () => {
      const { data: sites } = await supabase
        .from('sites')
        .select('id');
      
      if (!sites || sites.length === 0) return [];
      
      const contractHistoryPromises = sites.map(site => 
        contractHistoryApi.getContractHistory(site.id)
      );
      
      const contractResults = await Promise.all(contractHistoryPromises);
      return contractResults.flat();
    }
  });

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

  const handleImportContracts = async (data: any[], fileType: 'json' | 'csv' = 'json') => {
    try {
      if (fileType === 'csv') {
        data = convertCSVToContractFormat(data);
      }
      
      await importContracts(data);
      toast.success(`${data.length} contracts imported successfully`);
    } catch (error: any) {
      toast.error(`Failed to import contracts: ${error.message}`);
      throw error;
    }
  };

  const handleCSVImport = async (file: File, type: 'clients' | 'sites' | 'contracts'): Promise<void> => {
    try {
      const parsedData = await parseCSV(file);
      
      switch (type) {
        case 'clients':
          await handleImportClients(parsedData, 'csv');
          break;
        case 'sites':
          await handleImportSites(parsedData, 'csv');
          break;
        case 'contracts':
          await handleImportContracts(parsedData, 'csv');
          break;
      }
    } catch (error: any) {
      console.error(`Error importing ${type} from CSV:`, error);
      toast.error(`Failed to import ${type}: ${error.message}`);
      throw error;
    }
  };
  
  const handleUnifiedImport = async (file: File, options: { mode: 'full' | 'incremental' }): Promise<void> => {
    try {
      await handleUnifiedImportFn(file, options);
      toast.success('Import completed successfully');
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      throw error;
    }
  };

  const setupTestData = async (): Promise<void> => {
    try {
      await setupTestDataFn();
    } catch (error: any) {
      // Error handling is already in setupTestDataFn
      throw error;
    }
  };

  return {
    contractHistory,
    isLoadingContracts,
    handleImportClients,
    handleImportSites,
    handleImportContracts,
    handleCSVImport,
    handleUnifiedImport,
    setupTestData,
    getClientCSVTemplate,
    getSiteCSVTemplate,
    getContractCSVTemplate
  };
}
