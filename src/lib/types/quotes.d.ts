
import { Frequency } from '@/types/common';

export interface QuoteSubcontractor {
  id: string;
  quoteId?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
}

export interface QuoteShift {
  id: string;
  quoteId?: string;
  day: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: string;
  level: number;
  allowances: string[];
  estimatedCost: number;
  location?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: string;
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
}
