
import { Day, EmploymentType, EmployeeLevel, Frequency, BillingFrequency, QuoteStatus } from './common';

export interface Quote {
  id: string;
  clientName: string;
  siteName?: string;
  status: string;
  totalPrice: number;
  laborCost: number;
  overheadPercentage: number;
  marginPercentage: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
}

export interface QuoteShift {
  id: string;
  quote_id?: string;
  day: Day;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimated_cost: number;
  location?: string;
  notes?: string;
  
  // Camel case aliases
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
  quote_id?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  
  // Camel case alias
  quoteId?: string;
}
