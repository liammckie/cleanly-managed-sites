
import { Day, EmployeeLevel, EmploymentType } from '@/lib/award/types';

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

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

export interface Subcontractor {
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
  rate?: number;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
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
  
  // Backward compatibility aliases
  clientName?: string; 
  siteName?: string;
  title?: string;
}
