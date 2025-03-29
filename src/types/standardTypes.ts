
// This file contains standardized types to be used across the application
// to prevent duplication and inconsistencies

export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';
export type ContractStatus = 'active' | 'pending' | 'expired' | 'terminated' | 'on-hold';
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';

export interface ContractTerm {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractType?: string;
  value?: number;
  notes?: string;
  status?: string;
  terms?: ContractTerm[];
  noticeUnit?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  reviewDate?: string;
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  terminationClause?: string;
  annualValue?: number;
  renewalLengthMonths?: number;
  renewalNotice?: number;
  // Fields for backward compatibility
  type?: string;
  renewalTerms?: string;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: Frequency;
  isRecurring: boolean;
  onHold: boolean;
  notes?: string;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  // DB compatible fields
  is_recurring?: boolean;
  on_hold?: boolean;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
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
  // DB compatible fields
  quote_id?: string;
  start_time?: string;
  end_time?: string;
  break_duration?: number;
  number_of_cleaners?: number;
  employment_type?: string;
  estimated_cost?: number;
}

export interface QuoteSubcontractor {
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
  // DB compatible fields
  quote_id?: string;
  is_flat_rate?: boolean;
  monthly_cost?: number;
}

export interface SystemUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  avatarUrl?: string;
  role?: {
    id: string;
    name: string;
    permissions: Record<string, boolean>;
  };
  status: 'active' | 'pending' | 'inactive';
  lastLogin?: string;
  phone?: string;
  title?: string;
  customId?: string;
  territories?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // DB compatible fields
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  role_id?: string;
  custom_id?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}
