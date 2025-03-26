
// Basic enums 
export enum Day {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday'
}

export type EmploymentType = 'full_time' | 'part_time' | 'casual';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once' | 'annually' | 'one_time' | 'per_event';

// Define PayCondition as a string type
export type PayCondition = string;

// Define interfaces for the award engine
export interface AwardData {
  baseRates: Record<EmployeeLevel, number>;
  casualLoading: number;
  allowances: PayCondition[];
  employeeLevelRates: Record<EmployeeLevel, { base: number }>;
  conditionRates: Record<string, RateDefinition>;
  settings: AwardSettings;
}

export interface PayAllowance {
  id: string;
  name: string;
  amount: number;
  description?: string;
  unit: string;
}

export interface RateDefinition {
  id: string;
  dayType: string;
  startTime: string;
  endTime: string;
  multiplier: number;
  percentage: number;
  description: string;
}

export interface EmployeeLevelRates {
  level: EmployeeLevel;
  baseRate: number;
  casualRate: number;
  base: number;
}

export interface AwardSettings {
  award: string;
  state: string;
  baseAwardLevel: EmployeeLevel;
  casualLoading: number;
  includeSuper: boolean;
  superRate: number;
  includeCasualLoading: boolean;
  includeWeekendRates: boolean;
  includePublicHolidayRates: boolean;
  includeEarlyMorningRates: boolean;
  includeLateNightRates: boolean;
  includeAllowances: boolean;
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  useModernAward: boolean;
  lastUpdated?: string;
}

export interface JobCostCalculationInput {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  overheadPercentage: number;
  marginPercentage: number;
}

export interface CostCalculationResult {
  totalCost: number;
  laborHours: number;
  breakdownByDay: Record<string, DayBreakdown>;
  byTimeOfDay: TimeOfDayBreakdown;
  overheadCost: number;
  profitMargin: number;
  finalPrice: number;
  baseRate: number;
  totalHours: number;
  laborCost: number;
  margin: number;
  price: number;
  totalCostBeforeMargin: number;
  items: Array<{
    condition: PayCondition;
    hours: number;
    rate: number;
    cost: number;
  }>;
}

export interface DayBreakdown {
  hours: number;
  cost: number;
  shifts: ShiftBreakdown[];
}

export interface ShiftBreakdown {
  day: Day;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
  cost: number;
}

export interface TimeOfDayBreakdown {
  standard: number;
  earlyMorning: number;
  lateNight: number;
  weekend: number;
  publicHoliday: number;
}

export interface JobShift {
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
}

export interface Subcontractor {
  id: string;
  name: string;
  service?: string;
  cost: number;
  frequency: Frequency;
  monthlyCost?: number;
  annualCost?: number;
}

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day | string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType | string;
  level: EmployeeLevel | number;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';

export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  clientName: string;
  site_name?: string;
  siteName: string;
  description?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile?: string;
  userId?: string;
  createdBy?: string;
  notes: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  suppliesCost?: number;
  equipmentCost?: number;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
  client_contact?: string;
  client_email?: string;
  client_phone?: string;
  site_address?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
}

export interface QuoteSubcontractor extends Subcontractor {
  quoteId: string;
  customServices?: string;
  isFlatRate?: boolean;
}
