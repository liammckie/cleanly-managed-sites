
import React from 'react';
import { useClients } from '@/hooks/useClients';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDataImportExport } from '@/hooks/useDataImportExport';
import { ImportExportHeader } from './ImportExportHeader';
import { ImportExportCardGrid } from './ImportExportCardGrid';
import { ImportExportInstructions } from './ImportExportInstructions';

export const ImportExportPage: React.FC = () => {
  const { clients, isLoading: isLoadingClients } = useClients();
  const { sites, isLoading: isLoadingSites } = useSites();
  const { 
    contractHistory, 
    isLoadingContracts,
    handleImportClients,
    handleImportSites,
    handleImportContracts,
    handleCSVImport,
    getClientCSVTemplate,
    getSiteCSVTemplate,
    getContractCSVTemplate
  } = useDataImportExport();
  
  if (isLoadingClients || isLoadingSites || isLoadingContracts) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  const handleCSVImportClients = (file: File) => handleCSVImport(file, 'clients');
  const handleCSVImportSites = (file: File) => handleCSVImport(file, 'sites');
  const handleCSVImportContracts = (file: File) => handleCSVImport(file, 'contracts');
  
  return (
    <div className="space-y-8">
      <ImportExportHeader />
      <ImportExportInstructions />
      <ImportExportCardGrid 
        clients={clients}
        sites={sites}
        contractHistory={contractHistory || []}
        onImportClients={handleImportClients}
        onImportSites={handleImportSites}
        onImportContracts={handleImportContracts}
        onCSVImportClients={handleCSVImportClients}
        onCSVImportSites={handleCSVImportSites}
        onCSVImportContracts={handleCSVImportContracts}
        getClientCSVTemplate={getClientCSVTemplate}
        getSiteCSVTemplate={getSiteCSVTemplate}
        getContractCSVTemplate={getContractCSVTemplate}
      />
    </div>
  );
};
