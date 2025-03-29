/**
 * Central hub for type exports
 * This file exports all types from the types directory to provide a single import point
 */

// Export common types
export * from './common';

// Resolve potential naming conflicts with explicit re-exports
export type { 
  UserRole, 
  UserProfile,
  UserProfileWithRole,
  SystemUser
} from './userTypes';

// Re-export UserStatus from userTypes (which re-exports from common)
export { UserStatus } from './userTypes';

// Export domain-specific types
export * from './clientTypes';
export * from './siteTypes';
export * from './contractTypes';
export * from './contactTypes';
export * from './contractorTypes';

// Export billing types
export * from './billingTypes';

// Export import/export types and validation types
// Use explicit re-exports to avoid naming conflicts
export type {
  ImportMode,
  ImportOptions,
  ImportResult,
  ExportOptions,
  ExportResult,
  FieldMapping
} from './importExportTypes';

export type {
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  ZodValidationResult,
  LegacyValidationResult
} from './validationTypes';

// Export validation conversion functions
export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from './validationTypes';

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

// Contract types
export type {
  Contract,
  ContractDetails,
  ContractTerm,
  DbContract
} from './contracts';

// Export adapters
export {
  adaptContractFromDb,
  adaptContractToDb,
  adaptContractDetailsToDb,
  adaptContractDetailsFromDb
} from '../adapters/contractAdapter';
