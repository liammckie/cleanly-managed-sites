
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export interface BillingLine {
  id: string; // Changed from optional to required
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  weeklyAmount?: number;   // Calculated weekly amount
  monthlyAmount?: number;  // Calculated monthly amount
  annualAmount?: number;   // Calculated annual amount
  onHold?: boolean;        // Flag to indicate if billing line is on hold
  holdStartDate?: string;  // When the hold started
  holdEndDate?: string;    // When the hold will end
  creditAmount?: number;   // Amount credited
  creditDate?: string;     // Date of credit
  creditReason?: string;   // Reason for the credit
}

export interface LaborPlan {
  workingDays?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  shiftStartTime: string;
  shiftEndTime: string;
  notes: string;
}

export interface BillingDetails {
  rate: string;
  billingFrequency: string;
  paymentTerms: string;
  invoiceMethod: string;
  accountNumber: string;
  purchaseOrderRequired: boolean;
  purchaseOrderNumber: string;
  billingEmail: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  useSiteAddress: boolean;
  contacts: any[]; // Replace with proper type
  taxId: string;
  xeroContactId: string;
  notes: string;
  billingContact?: string;
  billingPhone?: string;
  annualForecast?: string;
  serviceDeliveryType?: 'direct' | 'contractor';
  annualContractorCost?: number;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorCostFrequency?: 'weekly' | 'monthly' | 'annually';
  contractorInvoiceFrequency?: 'weekly' | 'monthly' | 'quarterly';
  weeklyBudget?: number;
  laborPlan?: LaborPlan;
  billingLines: BillingLine[];
  billingOnHold?: boolean;       // Flag to indicate if all billing is on hold
  billingHoldStartDate?: string; // When the hold started
  billingHoldEndDate?: string;   // When the hold will end
  billingHoldReason?: string;    // Reason for the hold
  totalWeeklyAmount?: number;    // Total weekly amount across all billing lines
  totalMonthlyAmount?: number;   // Total monthly amount across all billing lines
  totalAnnualAmount?: number;    // Total annual amount across all billing lines
}
