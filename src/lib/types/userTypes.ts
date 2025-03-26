
export type UserStatus = 'active' | 'pending' | 'inactive';

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  title: string;
  last_login: string | null;
  note: string;  // Note this is 'note' not 'notes'
  territories: string[];
  custom_id: string;
}
