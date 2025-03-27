
import { UserStatus } from './common';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  status: UserStatus;
  avatar_url?: string;
  role_id?: string;
  role?: UserRole;
  note?: string;
  title?: string;
  phone?: string;
  permissions?: string[];
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface UserRoleWithCount extends UserRole {
  user_count: number;
}
