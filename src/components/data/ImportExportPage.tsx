
import React from 'react';
import { useClients } from '@/hooks/useClients';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDataImportExport } from '@/hooks/useDataImportExport';
import { ImportExportHeader } from './ImportExportHeader';
import { ImportExportCardGrid } from './ImportExportCardGrid';

export const ImportExportPage: React.FC = () => {
  const { clients, isLoading: isLoadingClients } = useClients();
  const { sites, isLoading: isLoadingSites } = useSites();
  const { 
    contractHistory, 
    isLoadingContracts,
    handleImportClients,
    handleImportSites,
    handleImportContracts
  } = useDataImportExport();
  
  if (isLoadingClients || isLoadingSites || isLoadingContracts) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <ImportExportHeader />
      <ImportExportCardGrid 
        clients={clients}
        sites={sites}
        contractHistory={contractHistory || []}
        onImportClients={handleImportClients}
        onImportSites={handleImportSites}
        onImportContracts={handleImportContracts}
      />
    </div>
  );
};
