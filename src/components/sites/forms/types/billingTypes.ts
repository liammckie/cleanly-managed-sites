
export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

export interface BillingContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface BillingDetails {
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  billingEmail: string;
  contacts: BillingContact[];
  rate: number;
  billingFrequency: BillingFrequency;
  billingDay: string;
  billingTerms: string;
  billingNotes: string;
  billingMethod: string;
  billingContact: string;
  billingContactEmail: string;
  billingContactPhone: string;
  billingLines: BillingLine[];
  totalWeeklyAmount: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  invoiceAddress?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  xeroContactId?: string;
}
