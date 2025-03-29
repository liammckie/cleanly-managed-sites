
export interface SiteContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  isPrimary?: boolean;
  is_primary?: boolean; // For compatibility
  notes?: string;
}

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  isPrimary?: boolean;
  is_primary?: boolean; // For compatibility
  notes?: string;
}
