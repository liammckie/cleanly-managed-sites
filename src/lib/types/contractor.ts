
export interface ContractorRecord {
  id: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'inactive' | 'pending';
  tax_id?: string;
  user_id: string;
  hourly_rate?: number;
  day_rate?: number;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  abn?: string;
  contractor_type: string;
  specialty?: string[];
  notes?: string;
  custom_id?: string;
  services?: string[];
}

export interface ContractorHistoryEntry {
  id: string;
  contractor_id: string;
  contractor_data: any;
  notes?: string;
  version_number: number;
  created_at: string;
  created_by?: string;
}
