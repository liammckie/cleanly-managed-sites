
import { useState } from 'react';
import { useTestData } from './useTestData';
import { useImportClients } from './useImportClients';
import { useImportContractors } from './useImportContractors';
import { useImportSites } from './useImportSites';
import { useImportContracts } from './useImportContracts';

export function useDataImportExport() {
  const [activeTab, setActiveTab] = useState('import');
  const testData = useTestData();
  
  // Import hooks
  const {
    importClients,
    isImporting: isImportingClients,
    result: clientsResult
  } = useImportClients();
  
  const {
    importContractors,
    isImporting: isImportingContractors,
    result: contractorsResult
  } = useImportContractors();
  
  const {
    importSites,
    isImporting: isImportingSites,
    result: sitesResult
  } = useImportSites();
  
  const {
    importContracts,
    isImporting: isImportingContracts,
    result: contractsResult
  } = useImportContracts();
  
  // Overall import status
  const isImporting = 
    isImportingClients || 
    isImportingContractors || 
    isImportingSites || 
    isImportingContracts;
  
  return {
    activeTab,
    setActiveTab,
    testData: {
      createTestData: testData.generateTestData,
      isCreating: testData.isGenerating,
      result: testData.result
    },
    imports: {
      clients: {
        importClients,
        isImporting: isImportingClients,
        result: clientsResult
      },
      contractors: {
        importContractors,
        isImporting: isImportingContractors,
        result: contractorsResult
      },
      sites: {
        importSites,
        isImporting: isImportingSites,
        result: sitesResult
      },
      contracts: {
        importContracts,
        isImporting: isImportingContracts,
        result: contractsResult
      }
    },
    isImporting
  };
}
