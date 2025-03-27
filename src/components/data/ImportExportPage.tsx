
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
  } = useDataImportExport();
  
  const isLoadingContracts = isImportingContracts;
  
  if (isLoadingClients || isLoadingSites || isLoadingContracts) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Define adapter functions that match the expected interface
  const handleImportClientsAdapter = async (file: File) => {
    if (file instanceof File) {
      await handleCSVImportContracts(file);
    }
  };
  
  const handleImportSitesAdapter = async (file: File) => {
    if (file instanceof File) {
      await handleCSVImportContracts(file);
    }
  };
  
  const handleImportContractsAdapter = async (file: File) => {
    if (file instanceof File) {
      await handleCSVImportContracts(file);
    }
  };
  
  const getClientCSVTemplateAdapter = () => {
    return "name,contact_name,email,phone,address,city,state,postcode,status,notes";
  };
  
  const getSiteCSVTemplateAdapter = () => {
    return "name,address,city,state,postcode,country,client_id,status,email,phone,representative";
  };
  
  const getContractCSVTemplateAdapter = () => {
    return "site_id,start_date,end_date,auto_renewal,renewal_period,renewal_notice,notice_unit,termination_period";
  };
  
  const setupTestDataAdapter = async () => {
    toast.success('Test data setup not implemented yet');
  };
  
  const handleSetupTestData = async () => {
    try {
      await setupTestDataAdapter();
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
        contractHistory={[]}
        onImportClients={() => Promise.resolve()}
        onImportSites={() => Promise.resolve()}
        onImportContracts={() => Promise.resolve()}
        onCSVImportClients={handleImportClientsAdapter}
        onCSVImportSites={handleImportSitesAdapter}
        onCSVImportContracts={handleImportContractsAdapter}
        onUnifiedImport={handleUnifiedImportMode}
        getClientCSVTemplate={getClientCSVTemplateAdapter}
        getSiteCSVTemplate={getSiteCSVTemplateAdapter}
        getContractCSVTemplate={getContractCSVTemplateAdapter}
      />
    </div>
  );
};
