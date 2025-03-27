
export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
  department?: string;
  role?: string;
  position?: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  // Add missing properties
  isRecurring?: boolean;
  onHold?: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

export interface BillingDetails {
  billingAddress: BillingAddress;
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  billingEmail: string;
  contacts: BillingContact[];
  
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
  rate?: string;
  
  // Service delivery details
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  
  // Billing lines
  billingLines?: BillingLine[];
  
  // Xero integration
  xeroContactId?: string;
  
  // Additional calculated fields
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
}
