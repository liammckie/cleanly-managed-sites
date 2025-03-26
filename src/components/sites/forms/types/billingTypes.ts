
import { SiteStatus } from '@/lib/types/commonTypes';

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
  };
}

// These types are not re-exported to avoid conflicts
