
/**
 * Contact record interface from database
 */
export interface ContactRecord {
  id: string;
  name: string;
  entity_id: string;
  entity_type: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  is_primary: boolean;
  notes: string;
  is_flat_rate: boolean;
  hourly_rate: number;
  monthly_cost: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Contact filters for searching/filtering contacts
 */
export interface ContactFilters {
  entity_type?: string;
  entity_id?: string;
  search?: string;
  department?: string;
  role?: string;
}
