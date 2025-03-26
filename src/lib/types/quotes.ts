
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
  site_name?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
  
  // Camelcase aliases for frontend compatibility
  clientName?: string; 
  siteName?: string;
  title?: string;
  overheadPercentage?: number;
  marginPercentage?: number;
  totalPrice?: number;
  laborCost?: number;
  suppliesCost?: number;
  equipmentCost?: number;
  subcontractorCost?: number;
  createdAt?: string;
  updatedAt?: string;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
  overheadCost?: number;
  totalCost?: number;
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
  
  // Additional fields to match award/types Quote
  description?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  notes?: string;
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
}

export interface QuoteSubcontractor extends Subcontractor {
  quoteId: string;
}
