
// This file contains the types used by the award module

export type Day = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday" 
  | "public_holiday"
  | "weekday"; // Added to match the common type

export type EmploymentType = "casual" | "part_time" | "full_time";

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6; // Added 6 to match with the models type

export type Frequency = 
  | "daily" 
  | "weekly" 
  | "fortnightly" 
  | "monthly" 
  | "quarterly" 
  | "yearly" 
  | "once";

export type QuoteStatus = 
  | "draft" 
  | "sent" 
  | "approved" 
  | "rejected" 
  | "expired"
  | "pending"
  | "accepted";

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

export interface Quote {
  id: string;
  name: string;
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
  notes: string;
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
  
  // Additional fields for compatibility
  client_name: string;
  site_name?: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  overhead_cost: number;
  total_cost: number;
  margin_amount: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: 'days' | 'weeks' | 'months' | 'years';
  client_id?: string;
  site_id?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  client_contact?: string;
  client_email?: string;
  client_phone?: string;
  site_address?: string;
}
