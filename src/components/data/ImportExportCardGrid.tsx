
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
}

export const ImportExportCardGrid: React.FC<ImportExportCardGridProps> = ({
  clients,
  sites,
  contractHistory,
  onImportClients,
  onImportSites,
  onImportContracts
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ImportExportCard
        type="clients"
        data={clients}
        onImport={onImportClients}
        title="Clients"
        description="Export or import client records"
      />
      
      <ImportExportCard
        type="sites"
        data={sites}
        onImport={onImportSites}
        title="Sites"
        description="Export or import site records"
      />
      
      <ImportExportCard
        type="contracts"
        data={contractHistory || []}
        onImport={onImportContracts}
        title="Contracts"
        description="Export or import contract history"
      />
    </div>
  );
};
