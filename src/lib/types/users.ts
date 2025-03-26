
export type UserStatus = 'active' | 'pending' | 'inactive';

export interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  status: UserStatus;
  avatar_url?: string;
  title?: string;
  phone?: string;
  last_login?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
}
