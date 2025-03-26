
export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time' | 'fortnightly';

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
  // Missing fields
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  paymentTerms?: string;
  invoiceMethod?: string;
  useSiteAddress?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  // Invoice fields
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  // Service related fields
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
}
