
/**
 * User adapter module
 * Handles transformations between database and frontend user formats
 */
import { SystemUser, UserRole, DbUserRole } from '../types/userTypes';

/**
 * Convert database user to system user
 */
export function adaptUserFromDb(dbUser: any): SystemUser {
  if (!dbUser) return null;

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
    daily_summary: dbUser.daily_summary,
    
    // Add camelCase aliases for frontend use
    fullName: dbUser.full_name || `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim(),
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    avatarUrl: dbUser.avatar_url,
    customId: dbUser.custom_id,
    roleId: dbUser.role_id,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
    lastLogin: dbUser.last_login,
    dailySummary: dbUser.daily_summary
  };
}

/**
 * Convert system user to database format
 */
export function adaptUserToDb(user: SystemUser): any {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name || user.fullName,
    first_name: user.first_name || user.firstName,
    last_name: user.last_name || user.lastName,
    avatar_url: user.avatar_url || user.avatarUrl,
    title: user.title,
    phone: user.phone,
    custom_id: user.custom_id || user.customId,
    notes: user.notes, // Always use notes, not note
    territories: user.territories,
    status: user.status,
    role_id: user.role_id || user.roleId,
    created_at: user.created_at || user.createdAt,
    updated_at: user.updated_at || user.updatedAt,
    last_login: user.last_login || user.lastLogin,
    daily_summary: user.daily_summary || user.dailySummary
  };
}

/**
 * Convert database user role to frontend format
 */
export function adaptUserRoleFromDb(dbRole: DbUserRole): UserRole {
  if (!dbRole) return null;

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
    user_count: 'user_count' in dbRole ? (dbRole as any).user_count : undefined,
    
    // Add camelCase aliases for frontend use
    createdAt: dbRole.created_at,
    updatedAt: dbRole.updated_at,
    userCount: 'user_count' in dbRole ? (dbRole as any).user_count : undefined
  };
}

/**
 * Convert frontend user role to database format
 */
export function adaptUserRoleToDb(role: UserRole): DbUserRole {
  if (!role) return null;

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
    created_at: role.created_at || role.createdAt,
    updated_at: role.updated_at || role.updatedAt,
    user_count: role.user_count || role.userCount
  };
}
