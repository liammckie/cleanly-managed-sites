
import { adaptUserFromDb, adaptUserToDb, adaptUserRoleFromDb, adaptUserRoleToDb } from '@/lib/types/adapters/userAdapter';

// Re-export adapter functions from the new centralized adapter registry
export {
  adaptUserFromDb,
  adaptUserToDb,
  adaptUserRoleFromDb,
  adaptUserRoleToDb
};
