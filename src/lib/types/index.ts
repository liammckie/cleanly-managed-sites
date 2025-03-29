
/**
 * Central hub for type exports
 * This file exports all types from the types directory to provide a single import point
 */

// Export common types
export * from './common';

// Resolve potential naming conflicts with explicit re-exports
export type { 
  UserRole, 
  UserStatus, 
  SystemUser,
  UserProfile,
  UserProfileWithRole
} from './userTypes';

// Export domain-specific types
export type * from './clientTypes';
export type * from './siteTypes';
export type * from './contractTypes';
export type * from './contactTypes';
export type * from './contractorTypes';

// Export import/export types
export type * from './importExportTypes';
export type * from './validationTypes';
export type * from './billingTypes';

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

// Export validation conversion functions
export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from './validationTypes';

// Export WorkOrderRecord from the API directly to avoid circular dependencies
export type { WorkOrderRecord } from '../api/workorders/types';
