
import { Day, EmployeeLevel, EmploymentType, Frequency } from '@/lib/award/types';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export interface QuoteSubcontractor {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  contact_name?: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  name: string;
  client_name: string;
  clientName?: string;
  site_name?: string;
  siteName?: string;
  title?: string;
  description?: string;
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
  subcontractors?: QuoteSubcontractor[];
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
}

// Re-export for compatibility
export type {
  Day,
  EmployeeLevel,
  EmploymentType,
  Frequency
};

// For backward compatibility
export type Subcontractor = QuoteSubcontractor;
