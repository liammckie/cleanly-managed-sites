
import { QuoteShift, QuoteSubcontractor, Quote } from './models';
import { Json } from './common';

// Database interface definitions
export interface DbQuote {
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
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_profile?: string;
  notes?: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
}

export interface DbQuoteShift {
  id: string;
  quote_id: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: string;
  level: number;
  allowances: string[];
  estimated_cost: number;
  location: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DbQuoteSubcontractor {
  id: string;
  quote_id?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  created_at: string;
  updated_at: string;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
  services?: string[];
}

// API response and request types can be added here
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface QuoteDetailsProps {
  quote: Quote;
  onQuoteSelect?: (quoteId: string) => void;
}
