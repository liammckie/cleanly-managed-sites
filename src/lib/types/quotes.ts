
import { Day, EmployeeLevel, EmploymentType } from '@/lib/award/types';

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day | string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType | string;
  level: EmployeeLevel | number;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export interface Subcontractor {
  id: string;
  quoteId?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency | string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  
  // Adding snake_case properties for database compatibility
  business_name?: string;
  contact_name?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  name: string;
  client_name: string;
  clientName: string; // Making this required to match award/types
  site_name?: string;
  siteName?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  overheadPercentage: number; // Making this required to match award/types
  margin_percentage: number;
  marginPercentage: number; // Making this required to match award/types
  total_price: number;
  totalPrice: number; // Making this required to match award/types
  labor_cost: number;
  laborCost: number; // Making this required to match award/types
  supplies_cost?: number;
  suppliesCost?: number;
  equipment_cost?: number;
  equipmentCost?: number;
  subcontractor_cost: number;
  subcontractorCost: number; // Making this required to match award/types
  created_at: string;
  createdAt: string; // Making this required to match award/types
  updated_at: string;
  updatedAt: string; // Making this required to match award/types
  quote_number?: string;
  quoteNumber?: string;
  valid_until?: string;
  validUntil?: string;
  client_id?: string;
  clientId?: string;
  site_id?: string;
  siteId?: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
  
  // Required fields to match award/types
  notes: string;
  description?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  overhead_cost?: number;
  overheadCost?: number;
  total_cost?: number;
  totalCost?: number;
  margin_amount?: number;
  marginAmount?: number;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile?: string;
  userId?: string;
  createdBy?: string;
  created_by?: string;
}

export interface QuoteSubcontractor extends Subcontractor {
  quoteId: string;
}
