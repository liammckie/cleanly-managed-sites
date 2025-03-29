
/**
 * This file is deprecated - please import directly from @/lib/types/* instead
 * It is kept for backward compatibility only
 */

// Re-export all types from centralized locations
export * from './types/index';

// Specific re-exports for backward compatibility
export type {
  SystemUser,
  UserRole,
  UserStatus,
  Contract,
  ContractDetails,
  ContractHistoryEntry,
  ContractSummaryData,
  Json,
  ClientRecord,
  SiteRecord,
  ContactRecord,
  ContractorRecord,
  ContractorVersionHistoryEntry,
  SiteContact,
  WorkOrderRecord,
  BillingDetails,
  BillingLineItem,
  BillingSummary,
  ValidationResult,
  ValidationError
} from './types/index';

// Re-export adapters for backward compatibility
export {
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb,
  adaptContractFromDb,
  adaptContractToDb,
  adaptContractDetailsToDb,
  adaptContractDetailsFromDb,
  adaptContractDetailsToJson,
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from './types/index';
