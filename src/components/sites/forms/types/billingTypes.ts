
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
  
  // Billing method and contacts
  billingMethod: string;
  paymentTerms: string;
  billingLines: BillingLine[];
  contacts: BillingContact[];
  
  // Invoice preferences
  invoiceFrequency: string;
  invoiceDay?: string;
  invoiceEmail: string;
  
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
  
  // Contractor payment info
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
  
  // Additional fields for BillingDetailsSummary
  rate?: string;
  billingFrequency?: string;
  
  // Additional fields used in other components
  accountNumber?: string;
  
  // Totals
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Budget
  weeklyBudget?: number;
}
