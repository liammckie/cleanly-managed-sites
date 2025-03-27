
/**
 * Type definitions for quotes
 */

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'pending';

export interface QuoteSubcontractor {
  id: string;
  quoteId?: string;
  name: string;
  description: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  services?: string[];
  service?: string;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  business_name?: string;
  contact_name?: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  frequency: Frequency;
  total: number;
  notes?: string;
  category?: string;
}

export interface QuoteShift {
  id: string;
  quoteId: string;
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
  clientName?: string;
  site_name?: string;
  siteName?: string;
  description?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  overheadPercentage?: number;
  margin_percentage: number;
  marginPercentage?: number;
  total_price: number;
  totalPrice?: number;
  labor_cost: number;
  laborCost?: number;
  supplies_cost?: number;
  suppliesCost?: number;
  equipment_cost?: number;
  equipmentCost?: number;
  subcontractor_cost: number;
  subcontractorCost?: number;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
  quote_number?: string;
  quoteNumber?: string;
  valid_until?: string;
  validUntil?: string;
  client_id?: string;
  clientId?: string;
  site_id?: string;
  siteId?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
  notes?: string;
}
