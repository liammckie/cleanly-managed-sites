
// Re-export specific types from the lib/types.ts file to avoid duplicate exports
export type {
  UserRole,
  SystemUser,
  ClientRecord,
  ContactRecord,
  SiteRecord,
  ContractorRecord,
  ContractorVersionHistoryEntry
} from '../types';

// Export WorkOrderRecord directly from here to avoid conflicts
export type { WorkOrderRecord } from './workorders/types';
