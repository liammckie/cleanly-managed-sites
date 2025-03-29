
// Re-export with proper type syntax
export type { 
  UserRole, 
  UserProfile,
  UserStatus,
  UserPermission
} from '@/types/db';

// Define additional user-related types here
export interface UserRoleSummary {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

export interface UserProfileWithRole {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

// For backward compatibility
export type SystemUser = UserProfile;
