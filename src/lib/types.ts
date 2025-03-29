
// This file is deprecated - please import directly from @/lib/types/* instead
// It is kept for backward compatibility only

import { SystemUser, UserRole, UserStatus, adaptUserFromDb, adaptUserToDb, adaptUserRoleFromDb, adaptUserRoleToDb } from './types/users';
import { Contract, ContractDetails, adaptContractToFrontend, adaptContractToDb } from './types/contracts';

export type {
  SystemUser,
  UserRole,
  UserStatus,
  Contract,
  ContractDetails
};

export {
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb,
  adaptContractToFrontend,
  adaptContractToDb
};

// Re-export legacy types to avoid breaking changes
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
