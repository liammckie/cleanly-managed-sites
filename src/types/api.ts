
import { JsonValue } from './common';

export interface DbQuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
  services?: string[];
  custom_services?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  created_at?: string;
  updated_at?: string;
}
