
/**
 * Billing Types
 * Defines the data structures for billing information throughout the application
 */

export interface BillingContact {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

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
}

export interface BillingDetails {
  cycle?: string;
  method?: string;
  notes?: string;
  contact?: BillingContact;
  email?: string;
  phone?: string;
  poRequired?: boolean;
  onHold?: boolean;
  holdStartDate?: string;
  holdEndDate?: string;
  billingLines?: BillingLine[];
}

export interface BillingLineItem {
  id: string;
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  taxType?: string;
  accountCode?: string;
}

export interface BillingSummary {
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  averageMonthly: number;
  nextInvoiceDate?: string;
  lastInvoiceDate?: string;
  invoiceCount: number;
}
