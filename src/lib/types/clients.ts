
/**
 * Client record interface from database
 */
export interface ClientRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: string;
  email: string;
  phone: string;
  contact_name: string;
  custom_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  xero_contact_id?: string;
}

/**
 * Enhanced client record with additional properties
 */
export interface EnhancedClientRecord extends ClientRecord {
  total_sites?: number;
  active_sites?: number;
  total_revenue?: number;
  contract_value?: number;
}
