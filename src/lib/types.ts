
// Types for database records
export interface SiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: 'active' | 'inactive' | 'pending';
  representative: string;
  phone?: string;
  email?: string;
  created_at?: string;
  user_id?: string;
  client_id: string;
  monthly_cost?: number;
  monthly_revenue?: number;
  // Client data that may be joined from the query
  client_name?: string;
  // JSON fields
  security_details?: any;
  job_specifications?: any;
  periodicals?: any;
  replenishables?: any;
  contract_details?: any;
  billing_details?: any;
  subcontractors?: any;
  // Contacts
  contacts?: ContactRecord[];
}

export interface ClientRecord {
  id: string;
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Contacts
  contacts?: ContactRecord[];
}

export interface ContactRecord {
  id?: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
  notes?: string;
  entity_id: string; // Either client_id or site_id
  entity_type: 'client' | 'site';
  created_at?: string;
  updated_at?: string;
}
