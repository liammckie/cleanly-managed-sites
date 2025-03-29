
/**
 * This file is deprecated - please import directly from @/lib/types/* instead
 * It is kept for backward compatibility only
 */

// Re-export types from centralized locations
import {
  SystemUser,
  UserRole,
  UserStatus,
  Contract,
  ContractDetails,
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb,
  adaptContractFromDb as adaptContractToFrontend,
  adaptContractToDb,
  Json
} from './types';

// Re-export for backward compatibility
export type {
  SystemUser,
  UserRole,
  UserStatus,
  Contract,
  ContractDetails,
  Json
};

// Re-export adapters for backward compatibility
export {
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb,
  adaptContractToFrontend,
  adaptContractToDb
};
