
/**
 * Billing related type definitions
 */
import { Frequency } from './common';

/**
 * Billing line item for site billing
 */
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: Frequency;
  isRecurring: boolean;
  is_recurring?: boolean; // Database field
  onHold: boolean;
  on_hold?: boolean; // Database field
  notes?: string;
  weeklyAmount?: number;
  weekly_amount?: number; // Database field
  monthlyAmount?: number;
  monthly_amount?: number; // Database field
  annualAmount?: number;
  annual_amount?: number; // Database field
  holdStartDate?: string;
  hold_start_date?: string;
  holdEndDate?: string;
  hold_end_date?: string;
  creditAmount?: number;
  credit_amount?: number;
  creditDate?: string;
  credit_date?: string;
  creditReason?: string;
  credit_reason?: string;
}

/**
 * Billing address details
 */
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  postalCode?: string; // Alias for frontend compatibility
  country?: string;
}

/**
 * Billing contact
 */
export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
  is_primary?: boolean; // Database field
}

/**
 * Billing details for sites
 */
export interface BillingDetails {
  billingAddress?: BillingAddress;
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingLines?: BillingLine[];
  contacts?: BillingContact[];
  invoiceFrequency?: string;
  invoiceDay?: number;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  // Additional billing details
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
  xeroContactId?: string;
  rate?: number;
  invoiceMethod?: string;
  accountNumber?: string;
  billingFrequency?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  notes?: string;
}
