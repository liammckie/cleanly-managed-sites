
export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  isRecurring: boolean;
  onHold: boolean;
  holdStartDate?: string;
  holdEndDate?: string;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  creditAmount?: string;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingDetails {
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingAddress?: BillingAddress;
  billingLines: BillingLine[];
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  serviceDeliveryType?: 'direct' | 'contractor';
  weeklyBudget?: number;
  annualDirectCost?: number;
  annualContractorCost?: number;
  contactId?: string;
  contacts?: BillingContact[];
  
  // Additional fields used in components
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
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  accountNumber?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
}
