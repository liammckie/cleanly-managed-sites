
export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  line1?: string; // Added for backward compatibility
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  isRecurring?: boolean;
  onHold?: boolean;
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
  role: string;
  department?: string;
  isPrimary?: boolean;
  is_primary?: boolean; // For compatibility
  notes?: string;
}

export interface BillingDetails {
  billingAddress?: BillingAddress;
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingLines?: BillingLine[];
  serviceType?: string;
  deliveryMethod?: string;
  serviceDeliveryType?: 'direct' | 'contractor';
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  weeklyBudget?: number;
  rate?: string;
  xeroContactId?: string;
  
  // Added fields for compatibility with BillingDetailsSummary
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
  annualRevenue?: number;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  billingFrequency?: string;
  invoiceMethod?: string;
  accountNumber?: string;
  
  // Adding contacts field for compatibility
  contacts?: BillingContact[];
  
  // For site form data compatibility
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
}
