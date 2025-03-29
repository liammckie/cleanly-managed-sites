
// Re-export specific types from the lib/types index file to avoid duplicate exports
export type {
  UserRole,
  SystemUser,
  ClientRecord,
  ContactRecord,
  SiteRecord,
  ContractorRecord,
  ContractorVersionHistoryEntry
} from '@/lib/types';

// Export WorkOrderRecord directly from the workorders types
export type { WorkOrderRecord } from './workorders/types';
