
// Central hub for type exports to reduce duplicate definitions
export * from './users';
export * from './clients';
export * from './contracts';
export * from './sites';
export * from './common';
export * from './exportTypes';
export * from './importTypes';

// Re-export types from the contract adapter for backward compatibility
export { 
  adaptContractToFrontend, 
  adaptContractToDb, 
  adaptContractDetailsToDb, 
  adaptContractDetailsFromDb 
} from '@/lib/adapters/contractAdapter';

// Re-export user adapter functions for backward compatibility
export {
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb
} from './users';
