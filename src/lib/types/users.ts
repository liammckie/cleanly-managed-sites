
// Define UserStatus type since it's missing
export type UserStatus = "active" | "pending" | "inactive";

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  fullName?: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  avatar_url?: string;
  avatarUrl?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  customId?: string;
  notes?: string;   // Changed from note to notes to match database field
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  last_login?: string;
  lastLogin?: string;
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

export interface UserProfileWithRole {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  status?: UserStatus;
  role_id?: string;
  role?: UserRole;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

// Create a UserRoleObject alias to avoid type conflicts
export type UserRoleObject = {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
};

// Export the dbUserToSystemUser function
export const dbUserToSystemUser = (dbUser: any): SystemUser => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    full_name: dbUser.full_name,
    fullName: dbUser.full_name,
    first_name: dbUser.first_name,
    firstName: dbUser.first_name,
    last_name: dbUser.last_name,
    lastName: dbUser.last_name,
    avatar_url: dbUser.avatar_url,
    avatarUrl: dbUser.avatar_url,
    title: dbUser.title,
    phone: dbUser.phone,
    custom_id: dbUser.custom_id,
    customId: dbUser.custom_id,
    notes: dbUser.notes,
    territories: dbUser.territories || [],
    status: dbUser.status || 'active',
    role_id: dbUser.role_id,
    role: dbUser.role,
    created_at: dbUser.created_at,
    createdAt: dbUser.created_at,
    updated_at: dbUser.updated_at,
    updatedAt: dbUser.updated_at,
    last_login: dbUser.last_login,
    lastLogin: dbUser.last_login,
    daily_summary: dbUser.daily_summary
  };
};
