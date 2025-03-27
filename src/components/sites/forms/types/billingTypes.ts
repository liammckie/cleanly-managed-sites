
import { SiteStatus } from '@/types/common';

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
  phone?: string;
  position: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

export interface BillingDetails {
  // Address
  billingAddress: BillingAddress;
  useClientInfo: boolean;
  
  // For backward compatibility and form fields
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  
  // Billing method and contacts
  billingMethod: string;
  paymentTerms: string;
  billingLines: BillingLine[];
  contacts: BillingContact[];
  
  // Invoice preferences
  invoiceFrequency: string;
  invoiceDay?: string;
  invoiceEmail: string;
  
  // Invoice address fields
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  
  // Purchase order
  purchaseOrderRequired: boolean;
  purchaseOrderNumber?: string;
  clientPO?: string;
  clientReference?: string;
  
  // Revenue & cost info
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  
  // Xero integration
  xeroAccountId?: string;
  xeroContactId?: string;
  
  // Service delivery
  serviceType?: string;
  deliveryMethod?: string;
  serviceDeliveryType?: string;
  
  // Contractor payment info
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  contractorCostFrequency?: string;
  
  // Additional fields for components
  accountNumber?: string;
  weeklyBudget?: number;
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  invoiceMethod?: string;
  
  // Additional fields for BillingDetailsSummary
  rate?: string;
  billingFrequency?: string;
}
