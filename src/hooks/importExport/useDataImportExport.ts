
import { useState } from 'react';
import { useImportClients } from './useImportClients';
import { useImportSites } from './useImportSites';
import { useImportContracts } from './useImportContracts';
import { useImportContractors } from './useImportContractors';

export type ImportType = 'clients' | 'sites' | 'contracts' | 'contractors' | 'invoices';

export function useDataImportExport() {
  const [importType, setImportType] = useState<ImportType>('clients');
  const { handleCSVImportClients, isImporting: isImportingClients, importResults: clientImportResults } = useImportClients();
  const { handleCSVImportSites, isImporting: isImportingSites, importResults: siteImportResults } = useImportSites();
  const { handleCSVImportContracts, isImporting: isImportingContracts, importResults: contractImportResults } = useImportContracts();
  const { handleCSVImportContractors, isImporting: isImportingContractors, importResults: contractorImportResults } = useImportContractors();

  const isImporting = isImportingClients || isImportingSites || isImportingContracts || isImportingContractors;
  const importResults = importType === 'clients' ? clientImportResults 
                      : importType === 'sites' ? siteImportResults
                      : importType === 'contracts' ? contractImportResults
                      : contractorImportResults;

  const handleImportCSV = async (file: File): Promise<void> => {
    switch (importType) {
      case 'clients':
        return handleCSVImportClients(file);
      case 'sites':
        return handleCSVImportSites(file);
      case 'contracts':
        return handleCSVImportContracts(file);
      case 'contractors':
        return handleCSVImportContractors(file);
      default:
        throw new Error(`Unsupported import type: ${importType}`);
    }
  };

  return {
    importType,
    setImportType,
    isImporting,
    importResults,
    handleImportCSV,
  };
}
