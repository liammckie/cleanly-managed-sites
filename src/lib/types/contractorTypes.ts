
/**
 * Contractor related type definitions
 */
import { Json } from './common';

/**
 * Contractor record from database
 */
export interface ContractorRecord {
  id: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'pending' | 'inactive';
  notes?: string;
  abn?: string;
  contractor_type?: string;
  specialty?: string[];
  hourly_rate?: number;
  insurance_details?: Json;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Contractor document
 */
export interface ContractorDocument {
  id: string;
  contractor_id: string;
  name: string;
  document_type: string;
  file_path?: string;
  issue_date?: string;
  expiry_date?: string;
  reminder_days?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Contractor version history entry
 */
export interface ContractorVersionHistoryEntry {
  id: string;
  contractor_id: string;
  version_number: number;
  status: string;
  hourly_rate?: number;
  insurance_details?: Json;
  created_at: string;
  updated_at: string;
  created_by?: string;
  notes?: string;
}
