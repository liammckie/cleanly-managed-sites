
// Define UserStatus type since it's missing
export type UserStatus = "active" | "pending" | "inactive";

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;   // Changed from note to notes to match database field
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserRoleWithCount extends UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  user_count?: number;
}

// Create a UserRoleObject alias to avoid type conflicts
export type UserRoleObject = {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
};
