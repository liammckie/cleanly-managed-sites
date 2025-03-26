
import { Day, EmployeeLevel, EmploymentType, Frequency } from '@/lib/award/types';

export interface Quote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  notes: string;  // Make notes required
  overheadCost: number;
  totalCost: number;
  marginAmount: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  clientId?: string;
  siteId?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
}

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
  notes?: string;
  service?: string;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}
