
// Central hub for type exports to reduce duplicate definitions
export * from './users';
export * from './clients';
export * from './contracts';
export * from './sites';
export * from './contacts';
export * from './contractors';
export * from './common';
export * from './exportTypes';
export * from './importTypes';

// Re-export adapters from the contract module for backward compatibility
export { 
  adaptContractToFrontend, 
  adaptContractToDb, 
  adaptContractDetailsToDb, 
  adaptContractDetailsFromDb 
} from './contracts';
