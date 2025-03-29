
// Re-export with proper type syntax
export type { 
  UserRole, 
  UserProfile,
  UserStatus,
  UserPermission
} from './db';

import { UserRole as UserRoleType } from './db';

// Define additional user-related types here
export interface UserRoleSummary {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

export interface UserProfileWithRole extends UserRoleType {
  role?: UserRoleType;
}
