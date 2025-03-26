
export interface SiteContact {
  id?: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  department?: string;
  is_primary?: boolean;
  notes?: string;
}

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string; // Job title/role
  primary?: boolean;
  notes?: string;
}
