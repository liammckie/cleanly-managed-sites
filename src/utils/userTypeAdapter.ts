
import { UserProfileWithRole, UserRole, UserRoleObject } from '@/types/models';

export function adaptUserRole(dbRole: any): UserRole {
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: dbRole.permissions || {},
    created_at: dbRole.created_at,
    updated_at: dbRole.updated_at,
    user_count: dbRole.user_count || 0
  };
}

export function adaptUserRoleToApi(role: UserRole): any {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  };
}

export function adaptUserRoles(roles: any[]): UserRole[] {
  return roles.map(adaptUserRole);
}
