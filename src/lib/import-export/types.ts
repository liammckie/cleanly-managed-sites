
import { ClientRecord, SiteRecord } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export type ImportMode = 'full' | 'incremental';

export type ImportOptions = {
  mode: ImportMode;
};

export type ParsedImportData = {
  clients: any[];
  sites: any[];
  contracts: any[];
};
