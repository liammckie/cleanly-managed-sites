
import { BillingFrequency } from '@/types/common';

export interface BillingContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position?: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency?: string;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
  is_recurring?: boolean;
  on_hold?: boolean;
}

export interface BillingDetails {
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  contacts?: BillingContact[];
  rate?: number;
  billingFrequency?: BillingFrequency;
  billingDay?: string;
  billingNotes?: string;
  billingTerms?: string;
  billingMethod?: string;
  billingContact?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingLines?: BillingLine[];
  totalWeeklyAmount?: number;
}
