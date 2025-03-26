
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingDetails {
  billingCycle?: string;
  billingDay?: number;
  billingLines?: BillingLine[];
  billingNotes?: string;
  billingMethod?: string;
  serviceDeliveryType?: string;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
  
  // Adding missing properties for billing hold
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  
  // Adding missing properties for billing address
  useSiteAddress?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  
  // Adding missing properties for invoice details
  invoiceMethod?: string;
  invoiceFrequency?: string;
  invoiceDay?: number;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  
  // Adding missing properties for total amounts
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  
  // Adding missing properties for billing details
  billingFrequency?: string;
  paymentTerms?: string;
  
  // Adding missing properties for PO
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  
  // Additional details
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  rate?: number;
  weeklyBudget?: number;
  annualContractorCost?: number;
  xeroContactId?: string;
  
  // Contacts
  contacts?: BillingContact[];
}

export interface BillingContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isPrimary?: boolean;
}

export interface BillingAmounts {
  totalWeeklyAmount: number;
  totalMonthlyAmount: number;
  totalAnnualAmount: number;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}
