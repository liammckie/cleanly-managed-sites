
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
  onHold?: boolean;
}

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface BillingDetails {
  billingLines: BillingLine[];
  billingNotes?: string;
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  billingCycle?: string;
  billingFrequency?: string;
  paymentTerms?: string;
  invoiceMethod?: string;
  billingEmail?: string;
  useSiteAddress?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  contacts?: BillingContact[];
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
  serviceType?: string;
  deliveryMethod?: string;
  xeroContactId?: string;
}

export interface BillingAmounts {
  totalWeeklyAmount: number;
  totalMonthlyAmount: number;
  totalAnnualAmount: number;
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  primary?: boolean;
}
