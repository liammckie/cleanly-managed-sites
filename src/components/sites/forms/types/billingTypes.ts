
import { BillingFrequency } from '@/lib/types/commonTypes';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
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
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface BillingDetails {
  billingFrequency?: BillingFrequency;
  billingLines?: BillingLine[];
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  useSiteAddress?: boolean;
  contacts?: BillingContact[];
  rate?: number;
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Additional properties needed by components
  invoiceDay?: number;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  paymentTerms?: string;
  serviceType?: string;
  deliveryMethod?: string;
}
