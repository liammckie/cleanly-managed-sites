
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { getClientCSVTemplate, getSiteCSVTemplate, getContractCSVTemplate } from '@/lib/importValidation';
import { useImportClients } from './useImportClients';
import { useImportSites } from './useImportSites';
import { useImportContracts } from './useImportContracts';
import { useUnifiedImport } from './useUnifiedImport';
import { useTestData } from './useTestData';

export function useDataImportExport() {
  // Import the individual hooks
  const { handleImportClients, handleCSVImportClients } = useImportClients();
  const { handleImportSites, handleCSVImportSites } = useImportSites();
  const { handleImportContracts, handleCSVImportContracts } = useImportContracts();
  const { handleUnifiedImport } = useUnifiedImport();
  const { setupTestData } = useTestData();

  // Fetch all contract history
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

  // Create a generic CSV import handler
  const handleCSVImport = async (file: File, type: 'clients' | 'sites' | 'contracts'): Promise<void> => {
    switch (type) {
      case 'clients':
        await handleCSVImportClients(file);
        break;
      case 'sites':
        await handleCSVImportSites(file);
        break;
      case 'contracts':
        await handleCSVImportContracts(file);
        break;
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
