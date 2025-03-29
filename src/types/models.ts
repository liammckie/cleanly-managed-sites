
// Define interfaces for common use

// Contract interface
export interface Contract {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  auto_renewal?: boolean;
  renewal_period?: string;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  created_at: string;
  updated_at: string;
  
  // Camel case aliases for frontend use
  siteId?: string;
  clientId?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User profile and roles
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean | string>;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  // Camel case aliases
  fullName?: string;
  roleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Quote related interfaces
export interface Quote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  subcontractor_cost: number;
  quote_number?: string;
  valid_until?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  
  // Camel case aliases for frontend components
  clientName?: string;
  siteName?: string;
  overheadPercentage?: number;
  marginPercentage?: number;
  totalPrice?: number;
  laborCost?: number;
  subcontractorCost?: number;
  quoteNumber?: string;
  validUntil?: string;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  
  // Relationships
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
}

export interface QuoteShift {
  id: string;
  quote_id: string;
  day: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: string;
  level: number;
  allowances: string[];
  estimated_cost: number;
  location: string;
  notes: string;
  
  // Camel case aliases for frontend components
  quoteId?: string;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  numberOfCleaners?: number;
  employmentType?: string;
  estimatedCost?: number;
}

export interface QuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  notes?: string;
  service?: string;
  
  // Camel case aliases
  quoteId?: string;
  
  // Additional UI fields
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}

// SystemUser interface
export interface SystemUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
  roleId?: string;
  roleName?: string;
  createdAt: string;
  updatedAt?: string;
  phone?: string;
  title?: string;
  lastLogin?: string;
  avatarUrl?: string;
  notes?: string;
}

// BillingLine interface
export interface BillingLine {
  id: string;
  site_id?: string;
  description: string;
  amount: number;
  frequency?: string;
  is_recurring?: boolean;
  on_hold?: boolean;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
  
  // Camel case aliases
  siteId?: string;
  isRecurring?: boolean;
  onHold?: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

// Extended security details
export interface SecurityDetails {
  alarmCode?: string;
  keyLocation?: string;
  keyNumber?: string;
  accessNotes?: string;
  securityContact?: string;
  securityPhone?: string;
  securityCompany?: string;
  accessHours?: string;
  specialInstructions?: string;
  hasSecuritySystem?: boolean;
  accessInstructions?: string;
  notes?: string;
}

// Extended periodicals interface
export interface Periodicals {
  items?: PeriodicalItem[];
  notes?: string;
  glazing?: boolean;
  ceilings?: boolean;
  upholstery?: boolean;
  sanitizing?: boolean;
  pressureWashing?: boolean;
  nextGlazingDate?: string;
  nextCeilingsDate?: string;
  nextUpholsteryDate?: string;
  nextSanitizingDate?: string;
  nextPressureWashingDate?: string;
  glazingFrequency?: string;
  ceilingsFrequency?: string;
  upholsteryFrequency?: string;
  sanitizingFrequency?: string;
  pressureWashingFrequency?: string;
}

// Extended AdHocWorkAuthorization interface
export interface AdHocWorkAuthorization {
  canAuthorize?: boolean;
  authorizationLimit?: number;
  authorizationContact?: string;
  authorizationEmail?: string;
  authorizationPhone?: string;
  authorizationNotes?: string;
  purchaseOrderRequired?: boolean;
  approvalLimit?: number;
  requirePurchaseOrder?: boolean;
}

// BillingDetails with extended properties
export interface BillingDetails {
  billingFrequency?: string;
  billingCycle?: string;
  billingDay?: number;
  paymentTerms?: string;
  billingLines?: BillingLine[];
  billingEmail?: string;
  billingNotes?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  
  // Extended properties needed by components
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
  rate?: number;
  invoiceMethod?: string;
  accountNumber?: string;
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
}

// Periodical item
export interface PeriodicalItem {
  id?: string;
  name: string;
  description?: string;
  frequency: string;
  lastCompleted?: string;
  nextDue?: string;
  assignedTo?: string;
  status?: string;
  notes?: string;
}

// User status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

// Export a BillingContact interface
export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

// Export BillingAddress interface
export interface BillingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// FrontendQuoteShift interface for the UI
export interface FrontendQuoteShift {
  id: string;
  quoteId: string;
  day: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: string;
  level: number;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}
