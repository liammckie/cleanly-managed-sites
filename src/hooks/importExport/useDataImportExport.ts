
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
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

  const getClientCSVTemplate = () => {
    return 'name,email,phone,address,city,state,postcode,status\nExample Corp,contact@example.com,555-1234,123 Main St,New York,NY,10001,active';
  };

  const getSiteCSVTemplate = () => {
    return 'name,client_id,address,city,state,postcode,status,phone,email\nMain Office,client_123,456 Business Ave,Chicago,IL,60601,active,555-5678,site@example.com';
  };

  const getContractCSVTemplate = () => {
    return 'site_id,contract_details,notes,created_by,version_number\nsite_123,"{\"startDate\":\"2023-01-01\",\"endDate\":\"2024-01-01\"}",Initial contract,john.doe@example.com,1';
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
