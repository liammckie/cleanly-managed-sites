
export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
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

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

export interface BillingDetails {
  // Base properties
  billingAddress?: BillingAddress;
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  contacts?: BillingContact[];
  notes?: string;
  
  // Revenue properties
  billingLines?: BillingLine[];
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  
  // Invoice and address properties
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingFrequency?: string;
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceMethod?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  
  // Payment properties
  accountNumber?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  rate?: string;
  xeroContactId?: string;
  
  // Service delivery properties
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  serviceDeliveryType?: string;
  weeklyBudget?: number;
}
