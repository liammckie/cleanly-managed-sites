
// Export common types
export * from './common';

// Export user types with explicit type exports
export type { 
  UserRole, 
  UserProfile,
  UserProfileWithRole,
  SystemUser
} from './userTypes';

// Export status enums
export { UserStatus } from './common';

// Export domain types
export * from './clientTypes';
export * from './siteTypes';
export * from './contractTypes';
export * from './contactTypes';
export * from './contractorTypes';

// Export contract types
export type {
  Contract,
  ContractDetails,
  ContractTerm,
  DbContract,
  ContractSummaryData,
  ContractHistoryEntry,
  ContractData,
  GroupedContracts,
  ContractorChange,
  ContractForecast,
  ContractActivity
} from './contracts';

// Export billing types
export * from './billingTypes';

// Export import/export types
export type {
  DataImportType,
  DataExportType,
  ImportOptions,
  ImportResult,
  ValidationError,
  ValidationResult,
  ValidationMessage,
  ClientImportItem,
  ContractorImportItem,
  InvoiceImportItem,
  InvoiceLineItem
} from './importExport';

// Export validation types
export * from './validationTypes';
export * from './formTypes';

// Export adapter functions
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

// Export WorkOrderRecord type
export type { WorkOrderRecord } from '../api/workorders/types';

