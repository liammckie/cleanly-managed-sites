
/**
 * Central hub for type exports
 * This file exports all types from the types directory to provide a single import point
 */

// Export common types
export * from './common';

// Resolve potential naming conflicts with explicit re-exports
export { 
  UserRole, 
  UserStatus, 
  SystemUser 
} from './userTypes';

// Export domain-specific types
export * from './clientTypes';
export * from './siteTypes';
export * from './contractTypes';
export * from './contactTypes';
export * from './contractorTypes';

// Export import/export types
export * from './importExportTypes';
export * from './validationTypes';

// Export adapter functions for convenience
export { 
  adaptContractFromDb,
  adaptContractToDb, 
  adaptContractDetailsToDb, 
  adaptContractDetailsFromDb,
  adaptContractDetailsToJson
} from '../adapters/contractAdapter';

export {
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb
} from '../adapters/userAdapter';

// Export WorkOrderRecord from the API directly to avoid circular dependencies
export type { WorkOrderRecord } from '../api/workorders/types';
