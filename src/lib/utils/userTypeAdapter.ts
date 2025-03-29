
import type { UserProfile, UserRole } from '@/types/models';

export function adaptSystemUser(dbUser: any): UserProfile {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as UserRole,
    status: dbUser.status
  };
}
