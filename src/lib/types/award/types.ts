
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type EmploymentType = 'casual' | 'part_time' | 'full_time';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

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

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

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
  title?: string;
  client_name: string;
  clientName: string;
  site_name?: string;
  siteName: string;
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
  notes: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
}
