
export interface BillingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
  role?: string;
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
  billingAddress: BillingAddress;
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  rate?: number;
  invoiceFrequency?: string;
  invoiceDay?: string;
  accountNumber?: string;
  notes?: string;
  billingEmail?: string;
  billingContactName?: string;
  billingLines?: BillingLine[];
  
  // Invoice address fields
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  invoiceEmail?: string;
  
  // Billing cities
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  
  // Revenue fields
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  
  // Purchase order fields
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  
  // Billing amount totals
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Contractor cost fields
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  
  // Service delivery fields
  serviceDeliveryType?: string;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
  
  // Budget fields
  weeklyBudget?: number;
  
  // Xero integration
  xeroContactId?: string;
  invoiceMethod?: string;
  
  // Additional fields
  contacts?: BillingContact[];
}
