
import { Day, EmployeeLevel, EmploymentType } from '@/lib/award/types';

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day | string;  // Support both string and Day enum
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType | string;  // Support both string and EmploymentType enum
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
  is_flat_rate?: boolean;
  monthly_cost?: number;
  business_name?: string;
  contact_name?: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  clientName: string;
  site_name?: string;
  siteName: string;
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
  
  // Additional duplicated properties needed for type compatibility
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost?: number;
  equipmentCost?: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
}

export interface QuoteSubcontractor extends Subcontractor {
  quoteId: string;
}
