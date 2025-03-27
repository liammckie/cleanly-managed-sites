
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

export interface SystemUserInsert {
  id?: string;
  email: string;
  password?: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_id?: string;
  title?: string;
  custom_id?: string;
  notes?: string;
  status?: UserStatus;
  avatar_url?: string;
  territories?: string[];
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}
