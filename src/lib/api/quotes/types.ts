
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

export interface DbSubcontractor {
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
}
