
import { 
  Day, 
  EmploymentType, 
  EmployeeLevel, 
  Frequency, 
  QuoteStatus,
  Json
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

export interface FrontendQuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
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

export interface Contract {
  id: string;
  site_id: string;
  siteId?: string;
  client_id?: string;
  clientId?: string;
  siteName?: string;
  clientName?: string;
  contract_number?: string;
  contractNumber?: string;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  value?: number;
  monthly_revenue?: number;
  monthlyRevenue?: number;
  contract_details?: Json;
  contractDetails?: any;
  auto_renewal?: boolean;
  autoRenewal?: boolean;
  renewal_period?: string | number;
  renewalPeriod?: string | number;
  renewal_notice_days?: number;
  renewalNoticeDays?: number;
  termination_period?: string;
  terminationPeriod?: string;
  billing_cycle?: string;
  billingCycle?: string;
  service_frequency?: string;
  serviceFrequency?: string;
  service_delivery_method?: string;
  serviceDeliveryMethod?: string;
  is_primary?: boolean;
  isPrimary?: boolean;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
  contract_type?: string;
  contractType?: string;
  type?: string;
  status?: string;
}

export interface ContractActivity {
  id: string;
  contract_id: string;
  contractId: string;
  activity_type: string;
  action: string;
  timestamp: string;
  created_at: string;
  created_by?: string;
  userName: string;
  details: any;
  metadata?: any;
  description?: string;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

// Define BillingDetails and related types
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  postalCode?: string;
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

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: Frequency;
  isRecurring: boolean;
  is_recurring?: boolean;
  onHold: boolean;
  on_hold?: boolean;
  weeklyAmount?: number;
  weekly_amount?: number;
  monthlyAmount?: number;
  monthly_amount?: number;
  annualAmount?: number;
  annual_amount?: number;
  notes?: string;
}

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
export interface ContractActivityWithDetails extends ContractActivity {
  action: string;
  timestamp: string;
  userName: string;
  details: any;
  metadata?: any;
  description?: string;
}

// Extend AdHocWorkAuthorization with missing properties
export interface AdHocWorkAuthorization {
  approvalLimit?: number;
  requirePurchaseOrder?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  approvalMethod?: string;
  approvalContact?: string;
  notes?: string;
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
  format?: string;
}

// User profile and role types
export interface UserProfileWithRole {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  title?: string;
  phone?: string;
  status?: UserStatus;
  last_login?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

export interface UserRoleObject {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
}
