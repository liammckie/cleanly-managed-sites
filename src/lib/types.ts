import { PermissionsMap } from '@/types/permissions';

export type UserRole = {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
};

export type SystemUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  phone?: string;
  custom_id?: string;
  note?: string;
  territories?: string[];
  permissions?: PermissionsMap;
};
