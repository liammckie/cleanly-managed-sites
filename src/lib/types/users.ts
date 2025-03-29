
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

// Define UserStatus type since it's missing
export type UserStatus = "active" | "pending" | "inactive";

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  module: string;
}
