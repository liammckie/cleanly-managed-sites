
/**
 * User status enum
 */
export type UserStatus = 'active' | 'pending' | 'inactive';

/**
 * User role interface with permissions as Record
 */
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

/**
 * System user interface 
 */
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

/**
 * Convert database user to system user
 */
export function adaptUserFromDb(dbUser: any): SystemUser {
  return {
    id: dbUser.id,
    email: dbUser.email,
    full_name: dbUser.full_name || `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim(),
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    avatar_url: dbUser.avatar_url,
    title: dbUser.title,
    phone: dbUser.phone,
    custom_id: dbUser.custom_id,
    notes: dbUser.notes,
    territories: dbUser.territories || [],
    status: dbUser.status || 'active',
    role_id: dbUser.role_id,
    role: dbUser.role,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
    last_login: dbUser.last_login,
    daily_summary: dbUser.daily_summary
  };
}

/**
 * Adapter to convert system user to database format
 */
export function adaptUserToDb(user: SystemUser): any {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar_url: user.avatar_url,
    title: user.title,
    phone: user.phone,
    custom_id: user.custom_id,
    notes: user.notes,
    territories: user.territories,
    status: user.status,
    role_id: user.role_id,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_login: user.last_login,
    daily_summary: user.daily_summary
  };
}
