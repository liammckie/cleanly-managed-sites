
import { Frequency } from '@/lib/award/types';

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';
export type InvoiceMethod = 'email' | 'post' | 'both';

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
  id?: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary?: boolean;
}

export interface BillingDetails {
  // Basic billing information
  rate?: number;
  billingFrequency?: BillingFrequency;
  invoiceFrequency?: BillingFrequency;
  invoiceMethod?: InvoiceMethod;
  accountNumber?: string;
  taxId?: string;
  xeroContactId?: string;
  notes?: string;

  // Billing address
  useSiteAddress?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  
  // Billing contacts
  contacts?: BillingContact[];
  
  // Billing status
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  
  // Billing lines
  billingLines?: BillingLine[];
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Contractor costs
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
  
  // Labor plan
  laborPlan?: {
    daysPerWeek?: number;
    hoursPerDay?: number;
    weeklyHours?: number;
    ratePerHour?: number;
  };
}
