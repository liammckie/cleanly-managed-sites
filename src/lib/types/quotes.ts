
import { Day, EmploymentType, EmployeeLevel, Frequency, QuoteStatus } from '@/types/common';

export interface QuoteShift {
  id: string;
  quote_id: string;
  day: Day;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimated_cost: number;
  location: string;
  notes: string;
  
  // Camel case aliases for frontend components
  quoteId?: string;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  numberOfCleaners?: number;
  employmentType?: EmploymentType;
  estimatedCost?: number;
}

export interface QuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  
  // Additional fields used in the UI
  service?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  
  // Camel case alias
  quoteId?: string;
}

export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
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
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: 'days' | 'weeks' | 'months' | 'years';
  overhead_profile?: string;
  user_id?: string;
  created_by?: string;
  notes?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  
  // Client and site related fields (for convenience)
  clientName?: string;
  siteName?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  
  // UI convenience properties (to avoid property not found errors) 
  overheadPercentage?: number;
  marginPercentage?: number;
  totalPrice?: number;
  laborCost?: number;
  subcontractorCost?: number;
  createdAt?: string;
  updatedAt?: string;
  suppliesCost?: number;
  equipmentCost?: number;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
}
