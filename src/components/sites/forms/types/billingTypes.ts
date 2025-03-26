
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
}

export interface BillingContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface BillingAmounts {
  totalWeeklyAmount: number;
  totalMonthlyAmount: number;
  totalAnnualAmount: number;
}

export interface BillingDetails {
  billingLines?: BillingLine[];
  contacts?: BillingContact[];
  billingNotes?: string;
  // Billing status fields
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  // Billing configuration
  billingFrequency?: BillingFrequency;
  paymentTerms?: string;
  invoiceMethod?: string;
  billingEmail?: string;
  // Billing address fields
  useSiteAddress?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  // Purchase order fields
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  // Account information
  accountNumber?: string;
  taxId?: string;
  xeroContactId?: string;
  // Calculation fields
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
}
