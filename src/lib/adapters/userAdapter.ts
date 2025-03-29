
/**
 * Adapter functions for converting between database and frontend user formats
 */
import { SystemUser, UserRole } from '../types/userTypes';

/**
 * Convert database user record to frontend format
 */
export function adaptUserFromDb(dbUser: any): SystemUser {
  return {
    id: dbUser.id,
    email: dbUser.email,
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    full_name: dbUser.full_name,
    avatar_url: dbUser.avatar_url,
    role_id: dbUser.role_id,
    status: dbUser.status || 'active',
    last_login: dbUser.last_login,
    phone: dbUser.phone,
    title: dbUser.title,
    custom_id: dbUser.custom_id,
    territories: dbUser.territories || [],
    notes: dbUser.notes,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
    daily_summary: dbUser.daily_summary,
    // Add frontend fields for convenience
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    fullName: dbUser.full_name,
    avatarUrl: dbUser.avatar_url,
    roleId: dbUser.role_id,
    customId: dbUser.custom_id,
    lastLogin: dbUser.last_login,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
    dailySummary: dbUser.daily_summary,
    // Handle role conversion if present
    role: dbUser.role ? 
      (typeof dbUser.role === 'string' ? dbUser.role : adaptUserRoleFromDb(dbUser.role))
      : undefined
  };
}

/**
 * Convert frontend user to database format
 */
export function adaptUserToDb(user: Partial<SystemUser>): any {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name || user.firstName,
    last_name: user.last_name || user.lastName,
    full_name: user.full_name || user.fullName,
    avatar_url: user.avatar_url || user.avatarUrl,
    role_id: user.role_id || user.roleId,
    status: user.status,
    last_login: user.last_login || user.lastLogin,
    phone: user.phone,
    title: user.title,
    custom_id: user.custom_id || user.customId,
    territories: user.territories,
    notes: user.notes,
    created_at: user.created_at || user.createdAt,
    updated_at: user.updated_at || user.updatedAt,
    daily_summary: user.daily_summary || user.dailySummary
  };
}

/**
 * Convert database role to frontend format
 */
export function adaptUserRoleFromDb(dbRole: any): UserRole {
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: dbRole.permissions || {},
    created_at: dbRole.created_at,
    updated_at: dbRole.updated_at,
    user_count: dbRole.user_count,
    // Add frontend fields for convenience
    createdAt: dbRole.created_at,
    updatedAt: dbRole.updated_at,
    userCount: dbRole.user_count
  };
}

/**
 * Convert frontend role to database format
 */
export function adaptUserRoleToDb(role: Partial<UserRole>): any {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions || {},
    created_at: role.created_at || role.createdAt,
    updated_at: role.updated_at || role.updatedAt,
    user_count: role.user_count || role.userCount
  };
}
