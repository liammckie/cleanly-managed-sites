
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
    handleImportClients,
    isImporting: isImportingClients,
    importResults: clientsResult,
    handleCSVImportClients
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
    result: contractsResult,
    handleCSVImportContracts
  } = useImportContracts();
  
  // Define function for unified import mode
  const handleUnifiedImportMode = async (file: File, mode: 'full' | 'incremental') => {
    console.log(`Unified import (${mode}) started with file:`, file.name);
    // Implementation will be added later
    return Promise.resolve();
  };
  
  // Overall import status
  const isImporting = 
    isImportingClients || 
    isImportingContractors || 
    isImportingSites || 
    isImportingContracts;
  
  return {
    activeTab,
    setActiveTab,
    isImportingContracts,
    contractImportResults: contractsResult,
    handleCSVImportContracts,
    handleUnifiedImportMode,
    testData: {
      createTestData: testData.generateTestData,
      isCreating: testData.isGenerating,
      result: testData.result
    },
    imports: {
      clients: {
        importClients: handleImportClients,
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
