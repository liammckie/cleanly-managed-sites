
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
import { SiteRecord, ClientRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export const ImportExportPage: React.FC = () => {
  const { clients, isLoading: isLoadingClients } = useClients();
  const { data: sites = [], isLoading: isLoadingSites } = useSites();
  const { 
    activeTab,
    setActiveTab,
    isImportingContracts,
    contractImportResults, 
    handleCSVImportContracts,
    handleUnifiedImportMode,
    setupTestData = async () => {}, // Providing default implementations
    getClientCSVTemplate = () => "",
    getSiteCSVTemplate = () => "",
    getContractCSVTemplate = () => "",
    handleImportClients = async () => {},
    handleImportSites = async () => {},
    handleImportContracts = async () => {},
    handleCSVImport = async () => {},
    handleUnifiedImport = async () => {},
    contractHistory = []
  } = useDataImportExport();
  
  const isLoadingContracts = isImportingContracts;
  
  if (isLoadingClients || isLoadingSites || isLoadingContracts) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Create adapter functions to match interface expectations
  const handleCSVImportClientsWrapper = async (data: ClientRecord[]) => {
    if (data instanceof File) {
      await handleCSVImport(data, 'clients');
    } else {
      console.error("Expected File, received ClientRecord[]");
    }
  };
  
  const handleCSVImportSitesWrapper = async (data: SiteRecord[]) => {
    if (data instanceof File) {
      await handleCSVImport(data, 'sites');
    } else {
      console.error("Expected File, received SiteRecord[]");
    }
  };
  
  const handleCSVImportContractsWrapper = async (data: ContractHistoryEntry[]) => {
    if (data instanceof File) {
      await handleCSVImport(data, 'contracts');
    } else {
      console.error("Expected File, received ContractHistoryEntry[]");
    }
  };
  
  const getClientCSVTemplateWrapper = (): string => {
    return getClientCSVTemplate() || "";
  };
  
  const getSiteCSVTemplateWrapper = (): string => {
    return getSiteCSVTemplate() || "";
  };
  
  const getContractCSVTemplateWrapper = (): string => {
    return getContractCSVTemplate() || "";
  };
  
  const handleSetupTestData = async () => {
    try {
      await setupTestData();
      toast.success('Test data created successfully!');
    } catch (error: any) {
      toast.error(`Failed to create test data: ${error.message}`);
    }
  };
  
  // Ensure sites is always an array, even if it's a Promise
  const sitesArray = Array.isArray(sites) ? sites : [];
  
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
        sites={sitesArray}
        contractHistory={contractHistory || []}
        onImportClients={handleImportClients}
        onImportSites={handleImportSites}
        onImportContracts={handleImportContracts}
        onCSVImportClients={handleCSVImportClientsWrapper}
        onCSVImportSites={handleCSVImportSitesWrapper}
        onCSVImportContracts={handleCSVImportContractsWrapper}
        onUnifiedImport={handleUnifiedImport}
        getClientCSVTemplate={getClientCSVTemplateWrapper}
        getSiteCSVTemplate={getSiteCSVTemplateWrapper}
        getContractCSVTemplate={getContractCSVTemplateWrapper}
      />
    </div>
  );
};
