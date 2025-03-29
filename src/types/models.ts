import { 
  Day, 
  EmploymentType, 
  EmployeeLevel, 
  Frequency, 
  QuoteStatus 
} from '@/types/common';

// Quote and related types
export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  clientName: string;
  site_name?: string;
  siteName?: string;
  description?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  overheadPercentage: number;
  margin_percentage: number;
  marginPercentage: number;
  total_price: number;
  totalPrice: number;
  labor_cost: number;
  laborCost: number;
  supplies_cost?: number;
  suppliesCost?: number;
  equipment_cost?: number;
  equipmentCost?: number;
  subcontractor_cost: number;
  subcontractorCost: number;
  created_at: string;
  createdAt: string;
  updated_at: string;
  updatedAt: string;
  quote_number?: string;
  quoteNumber?: string;
  valid_until?: string;
  validUntil?: string;
  client_id?: string;
  clientId?: string;
  site_id?: string;
  siteId?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
  overhead_cost?: number;
  overheadCost?: number;
  total_cost?: number;
  totalCost?: number;
  margin_amount?: number;
  marginAmount?: number;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  expiry_date?: string;
  expiryDate?: string;
  contract_length?: number;
  contractLength?: number;
  contract_length_unit?: 'days' | 'weeks' | 'months' | 'years';
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  overhead_profile?: string;
  overheadProfile?: string;
  user_id?: string;
  userId?: string;
  created_by?: string;
  createdBy?: string;
  notes?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
}

export interface QuoteShift {
  id: string;
  quote_id: string;
  quoteId?: string;
  day: Day;
  start_time: string;
  startTime?: string;
  end_time: string;
  endTime?: string;
  break_duration: number;
  breakDuration?: number;
  number_of_cleaners: number;
  numberOfCleaners?: number;
  employment_type: EmploymentType;
  employmentType?: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimated_cost: number;
  estimatedCost?: number;
  location: string;
  notes: string;
}

export interface QuoteSubcontractor {
  id: string;
  quote_id: string;
  quoteId?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency | string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}

// Contract related data types
export interface ContractSummaryData {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  totalValue: number;
  totalContracts: number;
  expiringWithin30Days: number;
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  profitMargin: number;
  avgContractValue: number;
  expiredCount?: number;
}

export interface ContractData {
  id: string;
  name: string;
  client_id: string;
  site_id: string;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
  created_at: string;
  updated_at: string;
  is_primary?: boolean;
}

// Define BillingDetails and related types
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

export interface BillingDetails {
  billingAddress: BillingAddress;
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  billingEmail: string;
  billingLines: any[];
  contacts: BillingContact[];
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  notes?: string;
  totalAnnualAmount?: number;
}

// Interface for SiteFormData
export interface SiteFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  client_id?: string;
  client_name?: string;
  status: string;
  phone?: string;
  email?: string;
  representative?: string;
  customId?: string;
  contract_details?: any;
  contractDetails?: any;
  periodicals?: any[];
  replenishables?: any[];
  subcontractors?: any[];
  security?: any;
  specifications?: any;
  contacts?: any[];
  billingDetails: BillingDetails;
  notes?: string;
  postcode?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Add missing ContractActivity interface
export interface ContractActivity {
  id: string;
  contractId: string;
  contract_id: string;
  action: string;
  activity_type: string;
  timestamp: string;
  created_at: string;
  userName: string;
  created_by?: string;
  details: any;
  metadata?: any;
  description?: string;
}

// Add missing ContractHistoryEntry interface
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

// Export UserStatus enum properly
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

// Add ImportOptions interface
export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
}
