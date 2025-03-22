
import React from 'react';
import { ImportExportCard } from './ImportExportCard';
import { ClientRecord, SiteRecord } from '@/lib/types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

interface ImportExportCardGridProps {
  clients: ClientRecord[];
  sites: SiteRecord[];
  contractHistory: ContractHistoryEntry[];
  onImportClients: (data: ClientRecord[]) => Promise<void>;
  onImportSites: (data: SiteRecord[]) => Promise<void>;
  onImportContracts: (data: ContractHistoryEntry[]) => Promise<void>;
  onCSVImportClients?: (file: File) => Promise<void>;
  onCSVImportSites?: (file: File) => Promise<void>;
  onCSVImportContracts?: (file: File) => Promise<void>;
  getClientCSVTemplate?: () => string;
  getSiteCSVTemplate?: () => string;
  getContractCSVTemplate?: () => string;
}

export const ImportExportCardGrid: React.FC<ImportExportCardGridProps> = ({
  clients,
  sites,
  contractHistory,
  onImportClients,
  onImportSites,
  onImportContracts,
  onCSVImportClients,
  onCSVImportSites,
  onCSVImportContracts,
  getClientCSVTemplate,
  getSiteCSVTemplate,
  getContractCSVTemplate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ImportExportCard
        type="clients"
        data={clients}
        onImport={onImportClients}
        onCSVImport={onCSVImportClients}
        getCSVTemplate={getClientCSVTemplate}
        title="Clients"
        description="Export or import client records"
      />
      
      <ImportExportCard
        type="sites"
        data={sites}
        onImport={onImportSites}
        onCSVImport={onCSVImportSites}
        getCSVTemplate={getSiteCSVTemplate}
        title="Sites"
        description="Export or import site records"
      />
      
      <ImportExportCard
        type="contracts"
        data={contractHistory || []}
        onImport={onImportContracts}
        onCSVImport={onCSVImportContracts}
        getCSVTemplate={getContractCSVTemplate}
        title="Contracts"
        description="Export or import contract history"
      />
    </div>
  );
};
