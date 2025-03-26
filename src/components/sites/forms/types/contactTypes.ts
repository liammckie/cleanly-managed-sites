
export interface BillingContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface SiteContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  notes?: string;
  is_primary?: boolean;
  entity_id?: string;
  entity_type?: string;
}
