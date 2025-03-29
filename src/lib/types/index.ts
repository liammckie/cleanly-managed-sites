
// Central hub for type exports to reduce duplicate definitions
export * from './users';
export type { ClientRecord, EnhancedClientRecord } from './clients';
export type { Contract, ContractData, ContractDetails, ContractTerm } from './contracts';
export type { SiteRecord, SiteContact, EnhancedSiteRecord } from './sites';
export type { ContactRecord, ContactFilters } from './contacts';
export type { ContractorRecord, ContractorVersionHistoryEntry } from './contractors';
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
