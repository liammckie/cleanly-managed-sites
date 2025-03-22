
import React from 'react';
import { useClients } from '@/hooks/useClients';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDataImportExport } from '@/hooks/useDataImportExport';
import { ImportExportHeader } from './ImportExportHeader';
import { ImportExportCardGrid } from './ImportExportCardGrid';
import { ImportExportInstructions } from './ImportExportInstructions';
import { Button } from '@/components/ui/button';
import { Beaker } from 'lucide-react';
import { toast } from 'sonner';

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
    handleUnifiedImport,
    setupTestData,
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
  
  // Create wrapper functions to convert return type from Promise<boolean> to Promise<void>
  const handleCSVImportClients = async (file: File) => {
    await handleCSVImport(file, 'clients');
  };
  
  const handleCSVImportSites = async (file: File) => {
    await handleCSVImport(file, 'sites');
  };
  
  const handleCSVImportContracts = async (file: File) => {
    await handleCSVImport(file, 'contracts');
  };
  
  // Create a wrapper for unified import that returns Promise<void>
  const handleUnifiedImportWrapper = async (file: File, options: { mode: 'full' | 'incremental' }) => {
    await handleUnifiedImport(file, options);
  };
  
  const handleSetupTestData = async () => {
    try {
      await setupTestData();
      toast.success('Test data created successfully!');
    } catch (error: any) {
      toast.error(`Failed to create test data: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <ImportExportHeader />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSetupTestData}
          className="gap-2"
        >
          <Beaker className="h-4 w-4" />
          Create Test Data
        </Button>
      </div>
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
        onUnifiedImport={handleUnifiedImportWrapper}
        getClientCSVTemplate={getClientCSVTemplate}
        getSiteCSVTemplate={getSiteCSVTemplate}
        getContractCSVTemplate={getContractCSVTemplate}
      />
    </div>
  );
};
