
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
  notes?: string; // Standardized to 'notes', not 'note'
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
 * Database user role with permissions array (from database)
 */
export interface DbUserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

/**
 * User profile with role (for UI displays)
 */
export interface UserProfileWithRole extends SystemUser {
  role: UserRole;
}

/**
 * User profile (simplified user information)
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
}

/**
 * For creating a new user
 */
export interface SystemUserInsert extends Omit<SystemUser, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
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
    notes: dbUser.notes || dbUser.note, // Handle both note and notes for compatibility
    territories: dbUser.territories || [],
    status: dbUser.status || 'active',
    role_id: dbUser.role_id,
    role: dbUser.role ? adaptUserRoleFromDb(dbUser.role) : undefined,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
    last_login: dbUser.last_login,
    daily_summary: dbUser.daily_summary
  };
}

/**
 * Convert system user to database format
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
    notes: user.notes, // Always use notes, not note
    territories: user.territories,
    status: user.status,
    role_id: user.role_id,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_login: user.last_login,
    daily_summary: user.daily_summary
  };
}

/**
 * Convert database user role to frontend format
 */
export function adaptUserRoleFromDb(dbRole: DbUserRole): UserRole {
  // Convert permissions array to permissions object for frontend
  const permissionsObject: Record<string, boolean> = {};
  
  // If dbRole.permissions is an array, convert it to object
  if (Array.isArray(dbRole.permissions)) {
    dbRole.permissions.forEach(permission => {
      permissionsObject[permission] = true;
    });
  } else if (typeof dbRole.permissions === 'object' && dbRole.permissions !== null) {
    // If it's already an object, use it directly
    Object.assign(permissionsObject, dbRole.permissions);
  } else if (typeof dbRole.permissions === 'string') {
    // If it's a JSON string (from Supabase), parse it
    try {
      const parsedPermissions = JSON.parse(dbRole.permissions);
      if (Array.isArray(parsedPermissions)) {
        parsedPermissions.forEach(permission => {
          permissionsObject[permission] = true;
        });
      } else if (typeof parsedPermissions === 'object') {
        Object.assign(permissionsObject, parsedPermissions);
      }
    } catch (e) {
      console.error('Error parsing permissions:', e);
    }
  }
  
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: permissionsObject,
    created_at: dbRole.created_at,
    updated_at: dbRole.updated_at,
    user_count: 'user_count' in dbRole ? (dbRole as any).user_count : undefined
  };
}

/**
 * Convert frontend user role to database format
 */
export function adaptUserRoleToDb(role: UserRole): DbUserRole {
  // Convert permissions object to array for backend
  const permissionsArray: string[] = [];
  
  // Extract all permissions set to true
  Object.entries(role.permissions).forEach(([key, value]) => {
    if (value) {
      permissionsArray.push(key);
    }
  });
  
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: permissionsArray,
    created_at: role.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_count: role.user_count
  };
}

// Alias for backward compatibility
export const dbUserToSystemUser = adaptUserFromDb;
