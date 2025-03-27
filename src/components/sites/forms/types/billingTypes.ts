
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position: string;
  isPrimary?: boolean;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
  isRecurring: boolean;
  onHold: boolean;
}

export interface BillingDetails {
  billingAddress: BillingAddress;
  billingLines: BillingLine[];
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  invoiceEmail: string;
  billingCycle: string;
  billingContacts: BillingContact[];
  contractorInvoiceFrequency?: string;
  
  // Additional properties for compatibility
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  contacts?: BillingContact[];
  totalMonthlyAmount?: number;
  totalWeeklyAmount?: number;
  totalAnnualAmount?: number;
  
  // Service delivery related
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  
  // Invoice related
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceMethod?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  rate?: string;
}
