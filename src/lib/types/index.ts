
/**
 * Central hub for type exports
 * This file exports all types from the types directory to provide a single import point
 */

// Export common types
export * from './common';

// Export domain-specific types
export * from './userTypes';
export * from './clientTypes';
export * from './contractTypes';
export * from './siteTypes';
export * from './contactTypes';
export * from './contractorTypes';

// Export import/export types
export * from './importExportTypes';
export * from './validationTypes';

// Re-export adapters for convenience
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
