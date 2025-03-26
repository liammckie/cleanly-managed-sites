
import { BillingFrequency } from '@/types/common';

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingDetails {
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  contacts: BillingContact[];
  rate: number;
  billingFrequency: BillingFrequency;
  billingDay: string;
  billingTerms: string;
  billingNotes?: string;
  billingMethod: string;
  billingContact?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingLines?: BillingLine[];
  totalWeeklyAmount: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
}
