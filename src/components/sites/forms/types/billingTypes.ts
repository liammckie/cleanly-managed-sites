
/**
 * Types for billing-related data in the site form
 */

export interface BillingContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role?: string; // Added for compatibility with existing code
}

export interface BillingAddress {
  address: string;
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
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

export interface BillingDetails {
  useClientInfo?: boolean;
  clientPO?: string;
  clientReference?: string;
  billingContacts?: BillingContact[];
  billingAddress?: BillingAddress;
  billingLines?: BillingLine[];
  billingFrequency?: string;
  paymentTerms?: string;
  paymentMethod?: string;
  directDebit?: boolean;
  bankDetails?: {
    accountName?: string;
    bsb?: string;
    accountNumber?: string;
  };
  xeroContactId?: string;
  xeroItemId?: string;
  xeroAccountId?: string;
  notes?: string;
  contractorPaymentTerms?: string;
  contractorInvoiceFrequency?: string;
  
  // Additional properties used in UI components
  contacts?: BillingContact[];
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  rate?: number;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  invoiceMethod?: string;
  accountNumber?: string;
  
  // Service delivery properties
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  serviceType?: string;
  deliveryMethod?: string;
  serviceDeliveryType?: string;
  weeklyBudget?: number;
}
