
// Define UserStatus type
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

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface UserRoleWithCount extends UserRole {
  user_count?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
}

// Helper function to convert database format to application format
export const adaptUserRole = (dbRole: UserRole): UserRole => {
  // If permissions is an array, convert to object
  let processedPermissions: Record<string, boolean> = {};
  
  if (Array.isArray(dbRole.permissions)) {
    dbRole.permissions.forEach(permission => {
      processedPermissions[permission] = true;
    });
  } else if (typeof dbRole.permissions === 'object' && dbRole.permissions !== null) {
    processedPermissions = dbRole.permissions as Record<string, boolean>;
  }
  
  return {
    ...dbRole,
    permissions: processedPermissions
  };
};

// Helper function to convert application format to database format
export const adaptUserRoleToDb = (role: UserRole): UserRole => {
  // If permissions is an object, extract keys with true values
  let processedPermissions: string[] = [];
  
  if (typeof role.permissions === 'object' && role.permissions !== null && !Array.isArray(role.permissions)) {
    Object.entries(role.permissions as Record<string, boolean>).forEach(([key, value]) => {
      if (value) {
        processedPermissions.push(key);
      }
    });
  } else if (Array.isArray(role.permissions)) {
    processedPermissions = role.permissions;
  }
  
  return {
    ...role,
    permissions: processedPermissions
  };
};
