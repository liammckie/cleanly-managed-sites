
export type BillingFrequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

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

export interface BillingContact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  department?: string;
  isPrimary?: boolean;
}

export interface BillingDetails {
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  contacts: BillingContact[];
  rate?: number;
  billingFrequency?: BillingFrequency;
  billingDay?: string;
  billingTerms?: string;
  billingNotes?: string;
  billingMethod?: string;
  billingContact?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingLines?: BillingLine[];
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  paymentTerms?: string;
  invoiceMethod?: string;
  useSiteAddress?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  xeroContactId?: string;
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  serviceType?: string;
  deliveryMethod?: string;
  contractorInvoiceFrequency?: string;
  laborPlan?: any;
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
}
