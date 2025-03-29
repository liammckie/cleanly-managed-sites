
import { Frequency, QuoteStatus } from './common';

// Quote types
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
}

// For frontend usage (with camelCase property names)
export interface FrontendQuote {
  id: string;
  name: string;
  title?: string;
  clientName: string;
  siteName?: string;
  description?: string;
  status: QuoteStatus;
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost?: number;
  equipmentCost?: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
  shifts?: FrontendQuoteShift[];
  subcontractors?: FrontendQuoteSubcontractor[];
}

// Quote shift (from database - snake_case)
export interface QuoteShift {
  id: string;
  quote_id?: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: string;
  level: number;
  allowances: string[];
  estimated_cost: number;
  location?: string;
  notes?: string;
}

// Frontend version of QuoteShift (camelCase)
export interface FrontendQuoteShift {
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

// Quote subcontractor (from database - snake_case)
export interface QuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  service?: string;
  cost: number;
  frequency: string;  // Will use Frequency type from common
  isFlatRate?: boolean;
  email?: string;
  phone?: string;
  notes?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
}

// Frontend version of QuoteSubcontractor (camelCase)
export interface FrontendQuoteSubcontractor {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  service?: string;
  cost: number;
  frequency: Frequency;
  isFlatRate?: boolean;
  email?: string;
  phone?: string;
  notes?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
}

// Contract activity
export interface ContractActivity {
  id: string;
  contractId: string;
  action: string;
  timestamp: string;
  userName?: string;
  userId?: string;
  details?: string;
  metadata?: any;
  description?: string;
  created_at?: string;
}

// Contract history entry
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  version_number: number;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// System user
export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatarUrl?: string;
  role: string | { id: string; name: string; permissions: string[] };
  status: string;
  lastLogin?: string;
  phone?: string;
  title?: string;
  customId?: string;
  territories?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Import options
export interface ImportOptions {
  mode: 'create' | 'update' | 'upsert';
  skipExisting?: boolean;
  validateOnly?: boolean;
  batchSize?: number;
  onProgress?: (progress: number) => void;
}

// Billing line
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  is_recurring: boolean;
  on_hold: boolean;
  notes?: string;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
}
