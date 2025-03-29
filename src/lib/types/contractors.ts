
/**
 * Contractor record interface from database
 */
export interface ContractorRecord {
  id: string;
  name: string;
  business_name: string;
  abn: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: string;
  payment_terms: string;
  payment_method: string;
  bank_name?: string;
  bsb?: string;
  account_number?: string;
  account_name?: string;
  rates?: Record<string, number>;
  insurance_expiry?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Contractor version history entry
 */
export interface ContractorVersionHistoryEntry {
  id: string;
  contractor_id: string;
  version_number: number;
  contractor_details: any;
  notes?: string;
  created_at: string;
  created_by?: string;
}
