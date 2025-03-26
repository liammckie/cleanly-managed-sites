
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
  // Additional fields used in BillingDetailsSummary
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  // Fields for ContractDetailsStep
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  // Field for ReviewStep
  rate?: number;
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
  role?: string;
}
