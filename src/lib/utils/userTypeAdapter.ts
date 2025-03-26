
import { SystemUser as LibSystemUser } from '@/lib/types/users';
import { SystemUser as ModelsSystemUser, UserRole } from '@/types/models';

/**
 * Converts a SystemUser from lib/types/users to the format expected by types/models
 */
export function adaptSystemUser(user: LibSystemUser): ModelsSystemUser {
  return {
    ...user,
    status: user.status as "active" | "pending" | "inactive",
    role: user.role as unknown as UserRole
  } as ModelsSystemUser;
}
