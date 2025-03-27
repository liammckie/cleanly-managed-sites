
import { useState } from 'react';
import { useImportContracts } from './useImportContracts';
import { useUnifiedImport } from './useUnifiedImport';

export function useDataImportExport() {
  const [activeTab, setActiveTab] = useState('clients');
  
  const contractsImport = useImportContracts();
  const unifiedImport = useUnifiedImport();
  
  const handleCSVImportContracts = (file: File) => {
    return contractsImport.handleImportCSV(file);
  };
  
  const handleUnifiedImportMode = async (file: File, mode: 'full' | 'incremental') => {
    return unifiedImport.handleUnifiedImport(file, { mode });
  };
  
  return {
    activeTab,
    setActiveTab,
    isImportingContracts: contractsImport.isImporting,
    contractImportResults: contractsImport.importResults,
    handleCSVImportContracts,
    handleUnifiedImportMode
  };
}
