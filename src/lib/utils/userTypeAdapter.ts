
// This file is deprecated and kept for backward compatibility
// Please import types and adapters directly from '@/lib/types/users'
import { 
  UserProfile, 
  UserRole, 
  adaptUserRoleFromDb, 
  adaptUserRoleToDb 
} from '@/lib/types/users';

export type { UserRole };

export function adaptSystemUser(dbUser: any): UserProfile {
  return {
    id: dbUser.id,
    name: dbUser.name || dbUser.full_name,
    email: dbUser.email,
    role: dbUser.role?.name || dbUser.role || 'User',
    status: dbUser.status || 'active'
  };
}

// Re-export the adapter functions for backward compatibility
export const adaptUserRole = adaptUserRoleFromDb;
export const adaptUserRoleToApi = adaptUserRoleToDb;
