
import { UserRole as DbUserRole } from '@/types/users';

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export const adaptUserRole = (dbRole: DbUserRole): UserRole => {
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
  }
  
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: permissionsObject,
    created_at: dbRole.created_at,
    updated_at: dbRole.updated_at
  };
};

export const adaptUserRoleToApi = (role: UserRole): DbUserRole => {
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
    updated_at: new Date().toISOString()
  };
};
