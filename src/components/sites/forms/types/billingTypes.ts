
// Export the main types
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  on_hold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
  
  // For backward compatibility
  onHold?: boolean;
}

export interface BillingContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position?: string;
}

export interface BillingDetails {
  // Original fields
  rate?: number;
  billingFrequency?: BillingFrequency;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  billingName?: string;
  billingPhone?: string;
  billingCompany?: string;
  billingDepartment?: string;
  billingNotes?: string;
  billingLines?: BillingLine[];
  isPrepaid?: boolean;
  serviceDeliveryType?: 'direct' | 'contractor';
  isTaxable?: boolean;
  taxRate?: number;
  currency?: string;
  paymentTerms?: string;
  paymentMethod?: string;
  billingStartDate?: string;
  billingEndDate?: string;
  nextBillingDate?: string;
  lastBillingDate?: string;
  contacts?: BillingContact[];
  useClientBillingAddress?: boolean;
  paymentDueDate?: number;
  
  // Display amounts (calculated)
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Added fields for BillingDetailsStep compatibility
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  invoiceMethod?: string;
  useSiteAddress?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  
  // Invoice form fields
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  
  // Revenue fields
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  
  // Contractor cost fields
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  weeklyBudget?: number;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
  
  // Service delivery fields
  serviceType?: string;
  deliveryMethod?: string;
  
  // Xero integration
  xeroContactId?: string;
  
  // Special fields for labor cost calculation
  laborCalculation?: {
    method: 'fixed' | 'hourly' | 'weekly' | 'monthly';
    rate: number;
    hours?: number;
    days?: number;
    weeks?: number;
    overhead?: number;
    profit?: number;
  };
  
  // Special fields for contractor cost calculation
  contractorCalculation?: {
    method: 'fixed' | 'hourly' | 'weekly' | 'monthly';
    rate: number;
    hours?: number;
    days?: number;
    weeks?: number;
    margin?: number;
  };
  
  // For budget planning and operational costs
  operationalCosts?: {
    supplies?: number;
    equipment?: number;
    travel?: number;
    other?: number;
  };
  
  // For labor planning
  laborPlan?: {
    employees?: number;
    hoursPerDay?: number;
    daysPerWeek?: number;
    rate?: number;
    staffingLevel?: string;
    headcount?: number;
    hoursPerWeek?: number;
    costPerHour?: number;
  };
  
  // For backward compatibility
  totalWeeklyAmount?: number;
}
