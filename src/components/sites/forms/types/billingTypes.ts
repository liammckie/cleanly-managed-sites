
import { BillingLine, BillingContact, BillingAddress } from '@/types/models';

// Re-export the types correctly for TypeScript with isolatedModules
export type { BillingLine, BillingContact, BillingAddress };

// Define BillingDetails interface
export interface BillingDetails {
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
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
}
